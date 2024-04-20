import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function FormError({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      {/* <AlertTitle>Error</AlertTitle> */}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
