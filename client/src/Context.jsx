import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import BASE_URL from './config.js';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [boardsObjects, setBoardsObjects] = useState([]);
  const [vendorsObjects, setVendorsObjects] = useState([]);
  const [vendorsObjectsPerUser, setVendorsObjectsPerUser] = useState([]);
  const [activeBoardObject, setActiveBoardObject] = useState(null);
  const [tasksPerBoard, setTasksPerBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  const [guestsObjects, setGuestsObjects] = useState([]);
  const socket = io(BASE_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/user/profile`, { withCredentials: true });
      setUser(data.user);
      setBoardsObjects(data.boards);
    } catch (err) {
      console.error('Error fetching user:', err);
      setUser(null);
      setBoardsObjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });
    socket.on('newMessage', (message) => {
      console.log('New message received:', message);
    });
    return () => {
      socket.off('connect');
      socket.off('newMessage');
    };
  }, []);

  const fetchTasksPerBoard = async (boardId) => {
    if (!boardId) return;
    try {
      const { data } = await axios.get(`${BASE_URL}/api/task/board/${boardId}`, {
        withCredentials: true,
      });
      setTasksPerBoard(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setTasksPerBoard({ tasks: [] });
    }
  };

  const fetchVendorsPerBoard = async (boardId) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/vendor/vendorsPerBoard?boardId=${boardId}`,
        { withCredentials: true }
      );
      setVendorsObjects(data.vendors);
    } catch (err) {
      console.error('Error fetching vendors per board:', err);
      setVendorsObjects([]);
    }
  };

  useEffect(() => {
    if (activeBoardObject?._id) {
      fetchVendorsPerBoard(activeBoardObject._id);
    }
  }, [activeBoardObject]);

  const fetchVendorsPerUser = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/vendor/vendorsPerUser`, {
        withCredentials: true,
      });
      setVendorsObjectsPerUser(data.vendors);
    } catch (err) {
      console.error('Error fetching vendors per user:', err);
      setVendorsObjectsPerUser([]);
    }
  };

  useEffect(() => {
    fetchVendorsPerUser();
  }, []);

  const addMemberToBoardInContext = (boardId, addedMember) => {
    setBoardsObjects((prevBoards) =>
      prevBoards.map((board) =>
        board._id === boardId
          ? {
              ...board,
              members: [...board.members, addedMember],
            }
          : board
      )
    );
  };

  const fetchGuestsPerUser = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/guest/getGuestList`, {
        withCredentials: true,
      });
      setGuestsObjects(data.guests);
    } catch (err) {
      console.error('Error fetching guests:', err);
      setGuestsObjects([]);
    }
  };
  console.log(activeBoardObject, tasksPerBoard);
  return (
    <Context.Provider
      value={{
        user,
        setUser,
        fetchUser,
        loading,
        boardsObjects,
        setBoardsObjects,
        activeBoardObject,
        setActiveBoardObject,
        vendorsObjects,
        setVendorsObjects,
        tasksPerBoard,
        setTasksPerBoard,
        fetchTasksPerBoard,
        fetchVendorsPerBoard,
        fetchVendorsPerUser,
        addMemberToBoardInContext,
        vendorsObjectsPerUser,
        setVendorsObjectsPerUser,
        guestsObjects,
        setGuestsObjects,
        fetchGuestsPerUser,
        socket,
      }}
    >
      {children}
    </Context.Provider>
  );
};
