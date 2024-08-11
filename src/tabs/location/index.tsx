import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import EmployeeList from "./EmployeeList";
import BaseUrl from "../../../utils/config/baseurl";
import { MarkerF } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const Location: React.FC = () => {
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
  });

  useEffect(() => {
    // Fetch employees from the API
    BaseUrl.get("/api/v1/get-all-locations")
      .then((response) => {
        console.log("Fetched employees:", response.data.locations);
        setEmployees(response.data.locations);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const handleSelectEmployee = (id: string) => {
    const selectedEmployee = employees.find((emp) => emp._id === id);
    if (selectedEmployee && map) {
      const { latitude, longitude } = selectedEmployee.coordinates;
      map.panTo(new google.maps.LatLng(latitude, longitude));
      map.setZoom(30);
      setSelectedCoordinates({ latitude, longitude });
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {isLoaded ? (
        <>
          <div style={{ flex: 1 }}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={
                selectedCoordinates || { lat: 35.9137152, lng: 74.355935 }
              }
              zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {employees.map((employee) => (
                <MarkerF
                  key={employee._id}
                  position={{
                    lat: employee.coordinates.latitude,
                    lng: employee.coordinates.longitude,
                  }}
                  icon={{
                    url: employee.userDetail.avatar,
                    scaledSize: new google.maps.Size(50, 50),
                  }}
                />
              ))}
            </GoogleMap>
          </div>
          <div style={{ width: "300px", padding: "10px" }}>
            <EmployeeList
              employees={employees}
              onSelectEmployee={handleSelectEmployee}
            />
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Location;
