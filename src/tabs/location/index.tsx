import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import EmployeeList from "./EmployeeList";
import BaseUrl from "../../../utils/config/baseurl";
import { MarkerF } from "@react-google-maps/api";
import Div from "../../components/atom/Div";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

// Define types for employee and coordinates
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Employee {
  _id: string;
  coordinates: Coordinates;
  userDetail: {
    name: string;
    avatar: string;
  };
}

const Location: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [employees, setEmployees] = useState<any | Employee[]>([]);
  const [selectedCoordinates, setSelectedCoordinates] =
    useState<Coordinates | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
  });

  useEffect(() => {
    if (!isLoaded) return; // Wait until the map is fully loaded

    // Fetch employees from the API
    BaseUrl.get("/api/v1/get-all-locations")
      .then((response) => {
        setEmployees(response.data.locations);

        // Check if currentUser is in the employees array
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const matchedEmployee = response.data.locations.find(
          (emp: Employee) => emp.userDetail.name === currentUser.name
        );

        if (matchedEmployee && map) {
          const { latitude, longitude } = matchedEmployee.coordinates;
          map.panTo(new google.maps.LatLng(latitude, longitude));
          map.setZoom(15); // Adjust zoom level as needed
          setSelectedCoordinates({ latitude, longitude });
        }
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, [isLoaded, map]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
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
    <Div
      sx={{
        display: "flex",
        flexDirection: {
          lg: "row",
          xs: "column-reverse",
        },
      }}
    >
      {isLoaded ? (
        <>
          <div style={{ flex: 1 }}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={selectedCoordinates || { lat: 0, lng: 0 }}
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
                    scaledSize: new google.maps.Size(40, 40),
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
    </Div>
  );
};

export default Location;
