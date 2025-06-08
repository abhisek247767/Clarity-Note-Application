import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  Box,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { MutableRefObject, useState } from "react";
import useNotesHook, { Note } from "../hooks/useNotesHook";
import { DeleteIcon, WarningIcon } from "@chakra-ui/icons";

interface Props {
  note: Note;
  otherButtonRef: MutableRefObject<HTMLButtonElement | null>;
}

const DeleteForm = ({ note, otherButtonRef }: Props) => {
  const { deleteNote } = useNotesHook();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleManualClick = () => {
    if (otherButtonRef.current) {
      otherButtonRef.current.click();
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    handleManualClick();

    setTimeout(() => {
      deleteNote(note);
      toast({
        title: "Note deleted",
        description: `"${note.title}" has been permanently deleted.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleting(false);
      onClose();
    }, 600);
  };

  return (
    <>
      <Tooltip label="Delete note" placement="top">
        <IconButton
          size="sm"
          variant="ghost"
          aria-label="Delete"
          icon={<DeleteIcon />}
          color="red.500"
          _hover={{ bg: "red.50", color: "red.600" }}
          onClick={onOpen}
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(8px)" />
        <ModalContent maxW="md">
          <ModalHeader>
            <Flex align="center" gap={3}>
              <Box
                bg="red.100"
                rounded="full"
                boxSize="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <WarningIcon color="red.500" boxSize={5} />
              </Box>
              <Box>
                <Text fontWeight="semibold" fontSize="lg">
                  Delete Note
                </Text>
                <Text fontSize="sm" color="gray.500">
                  This action cannot be undone.
                </Text>
              </Box>
            </Flex>
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>


            <Text fontSize="sm" color="gray.200" mt={4}>
              Are you sure you want to permanently delete this note? This action cannot be undone.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" onClick={onClose} isDisabled={isDeleting} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              isDisabled={isDeleting}
              leftIcon={isDeleting ? <Spinner size="sm" /> : <DeleteIcon />}
            >
              {isDeleting ? "Deleting..." : "Delete Note"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteForm;
