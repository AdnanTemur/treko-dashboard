import { useEffect, useState } from "react";
import { Grid, Button } from "@mui/material";
import BaseUrl from "../../../utils/config/baseurl";
import Loader from "../../components/atom/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddIcon from "@mui/icons-material/Add";
import EmployeeCard from "./EmployeeCard";
import EditEmployeeDialog from "./EditEmployeeDialog";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";
import AddEmployeeDialog from "./AddEmployeeDialog";

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false); // Loader state for delete operation
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await BaseUrl.get<{ employees: any[] }>(
          "/api/v1/get-all-employees"
        );
        setEmployees(response.data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setOpenEditDialog(true);
  };

  const handleDelete = (employee: any) => {
    setSelectedEmployee(employee);
    setOpenDeleteDialog(true);
  };

  const handleAdd = (employee: any) => {
    setEmployees([...employees, employee]);
  };

  const handleUpdate = (updatedEmployee: any) => {
    setEmployees((prevEmployees: any[]) =>
      prevEmployees.map((emp) =>
        emp._id === updatedEmployee._id ? updatedEmployee : emp
      )
    );
    setOpenEditDialog(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedEmployee) {
      try {
        setDeleteLoading(true); // Start loader
        const response = await BaseUrl.delete(
          `/api/v1/delete-user/${selectedEmployee._id}`
        );

        if (response.status === 200) {
          setEmployees((prevEmployees) =>
            prevEmployees.filter((emp) => emp._id !== selectedEmployee._id)
          );
          toast.success("Employee deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("Failed to delete employee");
      } finally {
        setDeleteLoading(false); // Stop loader
        setOpenDeleteDialog(false);
      }
    }
  };

  if (loading) return <Loader />;
  return (
    <>
      <div style={{ textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
          sx={{ textTransform: "capitalize" }}
        >
          Add Employee
        </Button>
      </div>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {employees.map((employee, id) => (
          <Grid key={id} item xs={12} sm={6} md={12}>
            <EmployeeCard
              employee={employee}
              onEdit={() => handleEdit(employee)}
              onDelete={() => handleDelete(employee)}
            />
          </Grid>
        ))}
      </Grid>
      <EditEmployeeDialog
        open={openEditDialog}
        employee={selectedEmployee}
        onClose={() => setOpenEditDialog(false)}
        onUpdate={handleUpdate}
        setEmployee={setSelectedEmployee}
      />
      <DeleteEmployeeDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onDelete={handleConfirmDelete}
        loading={deleteLoading} // Pass loading state to dialog
      />
      <AddEmployeeDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAdd={handleAdd}
      />
      <ToastContainer />
    </>
  );
};

export default Employees;
