import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogic';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({fetchAgain}) => {

   const { user,selectedChat, setSelectedChat , chats,setChats } = ChatState();
  const [loggedUser,setLoggedUser] = useState();
  const toast = useToast();


    const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  },[fetchAgain])
  
  
   return  <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      // bg="orange.100"
       bg="rgb(218, 212, 197)"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="2px"
      borderColor="pink.300"
      marginBottom={2}
    >
      <Box 
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
         <Button
            display="flex"
            // fontSize={{ base: "10px", md: "15px", lg: "15px" }}
            fontSize={['10px', 'xl', '15px']}
            rightIcon={<AddIcon/>}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
      { chats?(
        <Stack overflowY='scroll'>
          {/* AI Chat at the top */}
          <Box
            onClick={() => setSelectedChat({ isAIChat: true })}
            cursor="pointer"
            bg={selectedChat && selectedChat.isAIChat ? "#38B2AC" : "#E6F3FF"}
            color={selectedChat && selectedChat.isAIChat ? "white" : "#2B6CB0"}
            px={3}
            py={3}
            borderRadius="lg"
            key="ai-chat"
            border="2px solid"
            borderColor={selectedChat && selectedChat.isAIChat ? "#38B2AC" : "#90CDF4"}
            boxShadow="0 4px 8px rgba(0,0,0,0.1)"
            _hover={{
              bg: selectedChat && selectedChat.isAIChat ? "#38B2AC" : "#BEE3F8",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 12px rgba(0,0,0,0.15)"
            }}
            transition="all 0.3s ease"
          >
            <Text fontSize="lg" fontWeight="bold" textAlign="center">
              🤖 Chat with AI
            </Text>
            <Text fontSize="xs" textAlign="center" mt={1} opacity={0.8}>
              Ask me anything!
            </Text>
          </Box>
          {/* User/group chats */}
           {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#e1edf3"}
                color={selectedChat === chat ? "white" : "#2B6CB0"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}

              >
              <Text fontWeight="bold"  opacity={0.8} >
                  {!chat.isGroupChat 
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName }
              </Text>
              {chat.latestMessage && (
                <Text  fontSize="xs" fontStyle="normal">
                  <b>{chat.latestMessage.sender.name} : </b>
                  {chat.latestMessage.content.length > 50
                    ? (chat.latestMessage.content.substring(0,51) + "...") : (chat.latestMessage.content)}
                </Text>
              )}
            </Box>
           ))}
        </Stack>
      ):(
        <ChatLoading/>
      )}
      </Box>

    </Box>
  
}

export default MyChats
