import {
  Button,
  Flex,
  FormControl,
  FormLabel,
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
  useDisclosure,
  useToast,
  Box,
  Icon,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { MdAdd } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import categories from "../constants/categories";
import useNotesHook from "../hooks/useNotesHook";
import { MdOutlineCategory } from "react-icons/md";
import { Plus, FileText, Tag, AlignLeft } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must contain at least 3 characters" })
    .max(40),
  description: z.string().min(0).max(200),
  category: z.enum(categories, {
    errorMap: () => ({ message: "Category is required." }),
  }),
});

type FormData = z.infer<typeof schema>;

const AddForm = () => {
  const { addNote } = useNotesHook();
  const [uniqueId, setUniqueId] = useState(uuidv4());
  const [charLeft, setCharLeft] = useState(0);
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

  const generateNewId = () => {
    const newId = uuidv4();
    setUniqueId(newId);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleCharChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setCharLeft(e.target.value.length);

  const onSubmit = (data: FieldValues) => {
    generateNewId();
    if (data) {
      //Didn't use spread operator because of an error
      const newNote = {
        title: data.title,
        description: data.description,
        category: data.category,
        id: uniqueId,
        completed: false,
        date: new Date().toISOString().slice(0, 10),
      };
      addNote(newNote);
    }

    setTimeout(() => {
      toast({
        title: "Note added.",
        description: data.title,
        variant: "solid",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 600);

    onClose();
    reset();
  };

  return (
    <>
      <Button
        size={{ base: "sm", sm: "md" }}
        leftIcon={<MdAdd />}
        colorScheme="primary"
        onClick={() => {
          setOverlay(<OverlayOne />);
          onOpen();
        }}
      >
        Add
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="lg">
        {overlay}
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>
              <VStack align="flex-start" spacing={2}>
                <Flex align="center" gap={2}>
                  <Box bg="gray.100" p={2} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon as={FileText} boxSize={5} color="gray.500" />
                  </Box>
                  <Text fontSize="xl" fontWeight="bold">
                    Create New Note
                  </Text>
                </Flex>
                <Text fontSize="sm" color="gray.500">
                  Add a new note to organize your thoughts and ideas
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
                    required
                    placeholder="Enter note title..."
                    colorScheme="primary"
                    maxLength={50}
                    size="md"
                  />
                  {errors?.title && (
                    <Text color="red.300" mt={2} fontSize="sm">
                      {errors?.title?.message}
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
                    <Text
                      fontSize="sm"
                      color="gray.500"
                    >{`${charLeft}/200`}</Text>
                  </Flex>
                  <Textarea
                    {...register("description")}
                    placeholder="Add description for your note..."
                    maxLength={200}
                    minH={"150px"}
                    onChange={handleCharChange}
                    size="md"
                  />
                  {errors?.description && (
                    <Text color="red.300" mt={2} fontSize="sm">
                      {errors?.description?.message}
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
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="md"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!isValid}
                  type="submit"
                  colorScheme="primary"
                  leftIcon={<Plus size={15} />}
                  fontSize={{ base: "sm", sm: "inherit" }}
                >
                  Create
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default AddForm;
