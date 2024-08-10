import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BaseUrl from "../../../utils/config/baseurl";

interface EditEmployeeDialogProps {
  open: boolean;
  employee: any | null;
  onClose: () => void;
  onUpdate: (updatedEmployee: any) => void;
  setEmployee: (employee: any) => void;
}

const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({
  open,
  employee,
  onClose,
  onUpdate,
  setEmployee,
}) => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [name, setName] = useState(employee?.name || "");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setEmployee({ ...employee, avatar: URL.createObjectURL(file) });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdateLoading(true);
      const formData = new FormData();

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      if (name.trim() !== "") {
        formData.append("name", name);
      }

      const response = await BaseUrl.post(
        `/api/v1/update-user/${employee._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully");

      // Update the employee in the parent component
      onUpdate(response.data.user);

      // Close the dialog
      onClose();
    } catch (error: any) {
      if (error.response) {
        toast.error(`Failed to update profile: ${error.response.data.message}`);
      } else if (error.request) {
        toast.error("Failed to update profile: No response from server");
      } else {
        toast.error(`Failed to update profile: ${error.message}`);
      }
    } finally {
      setUpdateLoading(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Employee</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Update the employee's details below:
        </DialogContentText>
        <Avatar
          alt={name}
          src={employee?.avatar}
          sx={{
            width: 56,
            height: 56,
            margin: "10px auto",
            border: "1px solid #09648C",
          }}
        />
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="avatar-upload"
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="avatar-upload">
          <Button variant="contained" component="span">
            Upload Avatar
          </Button>
        </label>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={updateLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpdateProfile}
          color="primary"
          disabled={updateLoading}
        >
          {updateLoading ? <CircularProgress size={20} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployeeDialog;
