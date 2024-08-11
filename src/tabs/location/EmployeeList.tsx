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
    onSelectEmployee(id); // Pass the selected employee's ID to the parent
  };
  console.log(employees);

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <Typography variant="h6" component="div" sx={{ mb: 2 }}>
        {employees.length} Employees are working
      </Typography>
      <List>
        {employees.map((employee) => (
          <ListItem
            key={employee._id}
            sx={{
              bgcolor:
                selectedEmployeeId === employee._id
                  ? "primary.light"
                  : "background.paper",
              color:
                selectedEmployeeId === employee._id
                  ? "primary.contrastText"
                  : "text.primary",
              "&:hover": {
                bgcolor:
                  selectedEmployeeId === employee._id
                    ? "primary.main"
                    : "grey.200",
              },
              mb: 1,
              borderRadius: 1,
            }}
            onClick={() => handleSelectEmployee(employee._id)}
          >
            <ListItemAvatar>
              <Avatar
                src={employee.userDetail.avatar}
                alt={employee.userDetail.name}
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
