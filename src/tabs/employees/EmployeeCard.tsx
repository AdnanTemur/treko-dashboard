import { Avatar, Card, CardContent, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Font, Title } from "../../../theme/type";

interface EmployeeCardProps {
  employee: any;
  onEdit: () => void;
  onDelete: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: "15px",
        background: "#F8F8F8",
      }}
      elevation={0}
    >
      <Avatar
        alt={employee.name}
        src={employee.avatar}
        sx={{
          width: 56,
          height: 56,
          margin: "10px",
          border: "1px solid #09648C",
        }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Title sx={{ fontWeight: "bold" }}>{employee.name}</Title>
        <Font sx={{ textTransform: "capitalize" }}>{employee.role}</Font>
      </CardContent>
      <IconButton onClick={onEdit}>
        <EditIcon color="primary" />
      </IconButton>
      <IconButton onClick={onDelete}>
        <DeleteIcon color="error" />
      </IconButton>
    </Card>
  );
};

export default EmployeeCard;
