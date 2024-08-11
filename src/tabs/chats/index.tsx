import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Avatar,
  Typography,
  List,
  ListItem,
  CardContent,
} from "@mui/material";
import BaseUrl from "../../../utils/config/baseurl";
import { Caption, Font, Title } from "../../../theme/type";

// Component for rendering a received message
const ReceivedMessage = ({ message }: any) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-start",
      mb: 2,
    }}
  >
    <Box
      sx={{
        maxWidth: "60%",
        bgcolor: "#E1F5FE",
        borderRadius: 4,
        padding: "8px 16px",
        borderBottomLeftRadius: 0,
      }}
    >
      <Caption sx={{ whiteSpace: "pre-wrap", fontSize: 13 }}>
        {message.text}
      </Caption>
      <Font sx={{ fontSize: 10, mt: 1 }}>
        {new Date(message.timestamp).toLocaleString()}
      </Font>
    </Box>
  </Box>
);

// Component for rendering a sent message
const SentMessage = ({ message }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      mb: 2,
    }}
  >
    <Box
      sx={{
        maxWidth: "60%",
        bgcolor: "#FFFBE4", // Light yellow for sent messages
        borderRadius: 4,
        padding: "8px 16px",
        borderBottomRightRadius: 0,
      }}
    >
      <Caption sx={{ whiteSpace: "pre-wrap", fontSize: 13 }}>
        {message.text}
      </Caption>
      <Font sx={{ fontSize: 10, mt: 1 }}>
        {new Date(message.timestamp).toLocaleString()}
      </Font>
    </Box>
  </Box>
);

const BossTraceChats: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedPair, setSelectedPair] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [emptyStateMessage, setEmptyStateMessage] = useState("");

  useEffect(() => {
    const fetchUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    const fetchEmployees = async () => {
      try {
        const { data } = await BaseUrl.get("/api/v1/get-all-employees");
        setEmployees(data?.employees || []);
      } catch (error) {
        console.log("Error fetching employees:", error);
        setEmptyStateMessage("Error fetching employees.");
      }
    };

    fetchUser();
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!selectedPair) return;

      setLoading(true);
      setEmptyStateMessage("");

      try {
        const { data, status } = await BaseUrl.get(
          `/api/v1/trace-employees-chats`,
          {
            params: {
              employeeId1: selectedPair[0]._id,
              employeeId2: selectedPair[1]._id,
            },
          }
        );

        if (status === 200) {
          const employee1Id = selectedPair[0]._id;
          const employee2Id = selectedPair[1]._id;

          const employee1Received =
            data.find((chat: any) => chat.userId === employee1Id)
              ?.messageReceived || [];
          const employee2Received =
            data.find((chat: any) => chat.userId === employee2Id)
              ?.messageReceived || [];

          setChatHistory([
            ...employee1Received.map((msg: any) => ({
              ...msg,
              user: "employee1",
            })),
            ...employee2Received.map((msg: any) => ({
              ...msg,
              user: "employee2",
            })),
          ]);

          if (
            employee1Received.length === 0 &&
            employee2Received.length === 0
          ) {
            setEmptyStateMessage("No chats found between these employees.");
          }
        } else {
          setEmptyStateMessage("No Conversation Found 💬");
        }
      } catch (error: any) {
        console.log(
          "Error fetching chat history:",
          error.response?.data || error.message
        );
        setEmptyStateMessage("No Chats Found");
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [selectedPair]);

  const generatePairs = (employees: any[]) => {
    const pairs = [];
    for (let i = 0; i < employees.length - 1; i++) {
      for (let j = i + 1; j < employees.length; j++) {
        if (
          employees[i]._id !== employees[j]._id &&
          employees[i].role !== "boss" &&
          employees[j].role !== "boss"
        ) {
          pairs.push([employees[i], employees[j]]);
        }
      }
    }
    return pairs;
  };

  const pairs = selectedEmployee
    ? generatePairs([
        selectedEmployee,
        ...employees.filter((emp) => emp._id !== selectedEmployee._id),
      ])
    : [];

  const renderChatItem = (item) => {
    if (item.user === "employee1") {
      return <ReceivedMessage key={item._id} message={item} />;
    } else {
      return <SentMessage key={item._id} message={item} />;
    }
  };
  return (
    <Box sx={{ display: "flex", height: "100vh", mt: 2, gap: 3 }}>
      <Box sx={{ width: "25%", p: 2, borderRadius: 2 }}>
        <Title sx={{ fontWeight: "bold" }}>Employees Chat History</Title>
        <List sx={{ mt: 3 }}>
          {employees.map((emp) => (
            <ListItem
              key={emp._id}
              button
              onClick={() => setSelectedEmployee(emp)}
              sx={{
                bgcolor:
                  emp._id === selectedEmployee?._id ? "#d3e3fc" : "#F8F8F8",
                mb: 1,
                borderRadius: 3,
              }}
            >
              <Avatar
                alt={emp.name}
                src={emp.avatar}
                sx={{
                  width: 45,
                  height: 45,
                  margin: "10px",
                  border: "1px solid #09648C",
                }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Title sx={{ fontWeight: "bold" }}>{emp.name}</Title>
                <Font sx={{ textTransform: "capitalize" }}>{emp.role}</Font>
              </CardContent>
            </ListItem>
          ))}
        </List>
      </Box>
      {pairs.length !== 0 && (
        <Box sx={{ width: "25%", p: 2, borderRadius: 2 }}>
          <Title sx={{ fontWeight: "bold", color: "transparent" }}>.</Title>

          {selectedEmployee ? (
            <List sx={{ mt: 3 }}>
              {pairs.map((pair, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => setSelectedPair(pair)}
                  sx={{
                    bgcolor: pair === selectedPair ? "#D3E3FC" : "#F8F8F8",
                    mb: 1,
                    borderRadius: 3,
                  }}
                >
                  <Avatar src={pair[1].avatar} sx={{ mr: 2 }} />
                  <CardContent sx={{ flex: 1 }}>
                    {/* <Title
                      sx={{ fontWeight: "bold" }}
                    >{`${pair[0].name} & ${pair[1].name}`}</Title> */}
                    <Title
                      sx={{ fontWeight: "bold" }}
                    >{` ${pair[1].name}`}</Title>
                    <Font
                      sx={{ textTransform: "capitalize" }}
                    >{`${pair[0].role} & ${pair[1].role}`}</Font>
                  </CardContent>
                </ListItem>
              ))}
            </List>
          ) : (
            <Font sx={{ mt: 4 }}>Select an employee to view pairs.</Font>
          )}
        </Box>
      )}
      {pairs.length !== 0 && chatHistory.length !== 0 && (
        <Box sx={{ flex: 1, p: 3, overflowY: "auto", width: "50%" }}>
          <Title sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
            Conversation
          </Title>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : emptyStateMessage ? (
            <Title sx={{ fontWeight: "bold", textAlign: "center", mt: 10 }}>
              {emptyStateMessage}
            </Title>
          ) : (
            <Box>{chatHistory.map((item) => renderChatItem(item))}</Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default BossTraceChats;
