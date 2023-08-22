import { Button, ButtonProps, Text } from "@chakra-ui/react";

function DecryptButton(props: ButtonProps) {
  delete props.width;
  return (
    <Button width={"140px"} height={"40px"} {...props}>
      <Text>Decrypt</Text>
    </Button>
  );
}

export default DecryptButton;
