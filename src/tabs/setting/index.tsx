import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";
import Div from "../../components/atom/Div";

interface User {
  avatar: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const Setting: React.FC = () => {
  const user: User = JSON.parse(localStorage.getItem("user") as string);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    window.location.reload();
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>
                <Avatar
                  sx={{ height: 100, width: 100 }}
                  src={user?.avatar}
                  alt={user?.name}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>{user?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>{user?.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>{user?.role}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Created At</TableCell>
              <TableCell>
                {new Date(user?.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Updated At</TableCell>
              <TableCell>
                {new Date(user?.updatedAt).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Div sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{ marginTop: "20px", width: 200, mt: 5 }}
        >
          Logout
        </Button>
      </Div>
    </div>
  );
};

export default Setting;
