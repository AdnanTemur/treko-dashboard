import React, { useState } from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";

interface Employee {
  _id: string;
  userDetail: {
    name: string;
    avatar: string;
    email: string;
  };
}

interface EmployeeListProps {
  employees: Employee[];
  onSelectEmployee: (id: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  onSelectEmployee,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );

  const handleSelectEmployee = (id: string) => {
    setSelectedEmployeeId(id);
    onSelectEmployee(id);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <Typography
        variant="h6"
        component="div"
        sx={{ mb: 2, textAlign: "center" }}
      >
        Locations
      </Typography>
      <List>
        {employees.map((employee) => (
          <ListItem
            key={employee._id}
            sx={{
              bgcolor:
                selectedEmployeeId === employee._id ? "#BEDBEB" : "#F8F8F8",
              color:
                selectedEmployeeId === employee._id ? "black" : "text.primary",
              "&:hover": {
                bgcolor:
                  selectedEmployeeId === employee._id ? "#BEDBEB" : "grey.200",
              },
              mb: 1,
              borderRadius: 3,
            }}
            onClick={() => handleSelectEmployee(employee._id)}
          >
            <ListItemAvatar>
              <Avatar
                src={employee.userDetail.avatar}
                alt={employee.userDetail.name}
                sx={{
                  width: 40,
                  height: 40,
                  margin: "10px",
                  border: "1px solid #09648C",
                }}
              />
            </ListItemAvatar>

            <ListItemText
              primary={employee.userDetail.name}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      width: "200px",
                    }}
                  >
                    {employee.userDetail.email}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default EmployeeList;
