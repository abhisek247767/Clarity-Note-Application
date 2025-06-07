import { Center, VStack, Icon, Text } from "@chakra-ui/react";
import { FaClipboardList } from "react-icons/fa";
import { useSearchText } from "../contexts/searchTextContext";
import { useIsChecked } from "../contexts/IsCheckedContext";
import { FaRegFileAlt } from "react-icons/fa";


const NoNotes = () => {
  const { searchText } = useSearchText();
  const { isChecked } = useIsChecked();

  return (
    <Center height="60vh">
      <VStack spacing={4} color="gray.500">
        <Icon
          as={searchText ? FaClipboardList : FaRegFileAlt}
          boxSize={20}
          color="gray.400"
        />
        <Text fontSize="xl" fontWeight="semibold" textAlign="center">
          {searchText
            ? "No notes found"
            : `No ${isChecked ? "completed " : ""}notes yet`}
        </Text>
        {!searchText && (
          <Text fontSize="md" color="gray.400">
            Start organizing your thoughts by creating a new note.
          </Text>
        )}
      </VStack>
    </Center>
  );
};

export default NoNotes;
