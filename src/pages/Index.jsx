import { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Input, Checkbox, Stack, useToast } from "@chakra-ui/react";
import { FaSignInAlt, FaSignOutAlt, FaPlus } from "react-icons/fa";

const API_URL = "https://backengine-htea.fly.dev";

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn]);

  const login = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setIsLoggedIn(true);
        toast({
          title: "Logged in successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Login failed",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAccessToken("");
    setTasks([]);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async (task) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        fetchTasks();
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        fetchTasks();
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        fetchTasks();
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <Box maxWidth="600px" margin="auto" padding="4">
      <Heading as="h1" size="xl" textAlign="center" marginBottom="8">
        Task Manager
      </Heading>

      {!isLoggedIn ? (
        <Box>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} marginBottom="4" />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} marginBottom="4" />
          <Button leftIcon={<FaSignInAlt />} colorScheme="blue" onClick={login}>
            Login
          </Button>
        </Box>
      ) : (
        <Box>
          <Button leftIcon={<FaSignOutAlt />} colorScheme="red" onClick={logout} marginBottom="4">
            Logout
          </Button>

          <Heading as="h2" size="lg" marginBottom="4">
            Tasks
          </Heading>

          <Stack spacing="4">
            {tasks.map((task) => (
              <Box key={task.id} borderWidth="1px" borderRadius="md" padding="4">
                <Checkbox isChecked={task.isDone} onChange={() => updateTask(task.id, { ...task, isDone: !task.isDone })} marginBottom="2">
                  <Text as={task.isDone ? "del" : "span"}>{task.title}</Text>
                </Checkbox>
                <Text fontSize="sm" color="gray.500">
                  {task.description}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Due: {task.dueDate}
                </Text>
                <Button size="sm" colorScheme="red" onClick={() => deleteTask(task.id)} marginTop="2">
                  Delete
                </Button>
              </Box>
            ))}
          </Stack>

          <Button
            leftIcon={<FaPlus />}
            colorScheme="green"
            onClick={() =>
              addTask({
                title: "New Task",
                description: "Task description",
                dueDate: "2023-06-30",
                isDone: false,
                label: "default",
              })
            }
            marginTop="4"
          >
            Add Task
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Index;
