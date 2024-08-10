import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import React, { useState } from "react";
import { PhotoCamera, Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (employee: any) => void;
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [employee, setEmployee] = useState<any>({
    name: "",
    email: "",
    avatar: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleChange =
    (field: keyof Partial<any>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmployee({ ...employee, [field]: e.target.value });
    };

  const handleAdd = async () => {
    if (
      !employee.name ||
      !employee.email ||
      !employee.password ||
      !employee.confirmPassword ||
      !employee.avatar
    ) {
      toast.error("Please fill in all fields, including avatar");
      return;
    }
    if (employee.password !== employee.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", employee.name);
      formData.append("email", employee.email);
      formData.append("password", employee.password);
      formData.append("confirmPassword", employee.confirmPassword);
      if (employee.avatar) {
        formData.append("avatar", employee.avatar);
      }

      const response = await axios.post(
        "http://localhost:8000/api/v1/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message === "User has been created successfully") {
        toast.success("Employee added successfully!");
        onAdd(response.data.user);
        onClose();
        setEmployee({
          name: "",
          email: "",
          avatar: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response.data.message || "Failed to add employee");
      }
    } catch (error: any) {
      console.error("Error adding employee:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while adding the employee");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsAvatarLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmployee({ ...employee, avatar: file });
        setIsAvatarLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill in the details to add a new employee:
        </DialogContentText>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <Avatar
            src={employee.avatar ? URL.createObjectURL(employee.avatar) : ""}
            style={{
              width: 100,
              height: 100,
              margin: "10px auto",
              border: "1px solid #09648C",
            }}
          />
          {isAvatarLoading ? (
            <CircularProgress style={{ marginTop: 10 }} />
          ) : (
            <>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="avatar-upload"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="avatar-upload">
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
            </>
          )}
        </div>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={employee.name}
          onChange={handleChange("name")}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={employee.email}
          onChange={handleChange("email")}
        />
        <TextField
          margin="dense"
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={employee.password}
          onChange={handleChange("password")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="dense"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={employee.confirmPassword}
          onChange={handleChange("confirmPassword")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={toggleConfirmPasswordVisibility}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          size="small"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={handleAdd}
          disabled={isSubmitting || isAvatarLoading}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
        >
          {isSubmitting ? "Adding..." : "Add Employee"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeDialog;
