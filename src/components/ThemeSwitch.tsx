import { IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { MdDarkMode, MdOutlineWbSunny } from "react-icons/md";

const ThemeSwitch = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Tooltip 
      label={colorMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      placement="bottom"
      hasArrow
    >
      <IconButton
        onClick={toggleColorMode}
        isRound={true}
        variant="solid"
        bg={"transparent"}
        aria-label="Change Theme"
        icon={colorMode === "dark" ? <MdDarkMode /> : <MdOutlineWbSunny />}
      />
    </Tooltip>
  );
};

export default ThemeSwitch;