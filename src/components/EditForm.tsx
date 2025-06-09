import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
  Box,
  Icon,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FaPencil } from "react-icons/fa6";
import categories from "../constants/categories";
import useNotesHook, { Note } from "../hooks/useNotesHook";
import { z } from "zod";
import { FileText, Tag, AlignLeft, Save } from "lucide-react";
import { MdOutlineCategory } from "react-icons/md";

interface Props {
  note: Note;
}

const schema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must contain at least 3 characters" })
    .max(50),
  description: z.string().min(0).max(200),
  category: z.enum(categories, {
    errorMap: () => ({ message: "Category is required." }),
  }),
});

type FormData = z.infer<typeof schema>;

const EditForm = ({ note }: Props) => {
  const { updateNote } = useNotesHook();
  const [charLeft, setCharLeft] = useState(note.description?.length || 0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter={`blur(10px) hue-rotate(0)`}
      transition="background-color 0.3s ease-in-out"
    />
  );
  const [overlay, setOverlay] = useState(<OverlayOne />);

  const handleCharChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setCharLeft(e.target.value.length);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FieldValues) => {
    if (data) {
      const updatedNote = {
        ...note,
        ...data,
        date: new Date().toISOString().slice(0, 10),
      };
      updateNote(updatedNote);
    }
    setTimeout(() => {
      toast({
        title: "Note updated.",
        description: note.title,
        variant: "solid",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 600);
    onClose();
  };

  return (
    <>
      <Tooltip placement="top" label="Edit">
        <IconButton
          size={{ base: "sm", sm: "md" }}
          isRound={true}
          variant="solid"
          bg={"transparent"}
          aria-label="Edit"
          icon={<FaPencil />}
          onClick={() => {
            setOverlay(<OverlayOne />);
            onOpen();
          }}
        />
      </Tooltip>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="lg">
        {overlay}
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>
              <VStack align="flex-start" spacing={2}>
                <Flex align="center" gap={3}>
                  <Box bg="gray.100" p={2} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon as={FileText} boxSize={5} color="gray.500" />
                  </Box>
                  <Text fontSize="xl" fontWeight="bold">
                    Edit Note
                  </Text>
                </Flex>
                <Text fontSize="sm" color="gray.500">
                  Update your note details below
                </Text>
              </VStack>
            </ModalHeader>
            <ModalCloseButton mt={2} />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <HStack spacing={3} mb={2}>
                    <Icon as={Tag} boxSize={5} color="gray.500" />
                    <FormLabel fontSize="md" fontWeight="medium" mb={0}>
                      Title
                    </FormLabel>
                  </HStack>
                  <Input
                    {...register("title")}
                    fontSize="md"
                    autoFocus
                    defaultValue={note.title}
                    placeholder="Note title"
                    maxLength={50}
                    size="md"
                  />
                  {errors.title && (
                    <Text color="red.300" mt={2} fontSize="sm">
                      {errors.title.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <Flex alignItems="center" mb={2}>
                    <HStack spacing={3}>
                      <Icon as={AlignLeft} boxSize={5} color="gray.500" />
                      <FormLabel fontSize="md" fontWeight="medium" mb={0}>
                        Description (optional)
                      </FormLabel>
                    </HStack>
                    <Spacer />
                    <Text fontSize="sm" color="gray.500">
                      {`${charLeft}/200`}
                    </Text>
                  </Flex>
                  <Textarea
                    {...register("description")}
                    defaultValue={note.description}
                    maxLength={200}
                    minH={"150px"}
                    placeholder="Description..."
                    onChange={handleCharChange}
                    size="md"
                  />
                  {errors.description && (
                    <Text color="red.300" mt={2} fontSize="sm">
                      {errors.description.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <HStack spacing={3} mb={2}>
                    <Icon as={MdOutlineCategory} boxSize={5} color="gray.500" />
                    <FormLabel fontSize="md" fontWeight="medium" mb={0}>
                      Category
                    </FormLabel>
                  </HStack>
                  <Select
                    {...register("category")}
                    defaultValue={note.category}
                    fontSize="md"
                    size="md"
                  >
                    {categories.map(
                      (cat, index) =>
                        index > 0 && (
                          <option key={index} value={cat}>
                            {cat}
                          </option>
                        )
                    )}
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <HStack spacing={4}>
                <Button onClick={onClose} variant="outline" size="md">
                  Cancel
                </Button>
                <Button
                  disabled={!isValid}
                  type="submit"
                  colorScheme="primary"
                  leftIcon={<Save size={18} />}
                  size="md"
                >
                  Update
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default EditForm;