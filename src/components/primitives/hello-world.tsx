import * as React from "react"

import { cn } from "../../lib/utils"

export interface HelloWorldProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
}

function HelloWorld({ className, message = "Hello, World!", ...props }: HelloWorldProps) {
  return (
    <div
      className={cn("bg-card text-card-foreground rounded-lg border p-8 shadow-sm", className)}
      {...props}
    >
      <h1 className="mb-4 text-2xl font-bold">{message}</h1>
      <p className="text-muted-foreground">
        Welcome to Agora AI Builder UI! This is your first component .
      </p>
    </div>
  )
}

export { HelloWorld }
