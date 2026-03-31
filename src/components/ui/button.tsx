import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import "./button2.css"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-light transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        button2:
          "uiverse !inline-block !h-auto !rounded-[24px] !p-0 !font-semibold !text-base",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const isButton2 = variant === "button2" && !asChild
  const computedSize = isButton2 ? undefined : size

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size: computedSize, className }))}
      {...props}
    >
      {isButton2 ? (
        <span className="wrapper">
          <span>{children}</span>
          <span className="circle circle-12" />
          <span className="circle circle-11" />
          <span className="circle circle-10" />
          <span className="circle circle-9" />
          <span className="circle circle-8" />
          <span className="circle circle-7" />
          <span className="circle circle-6" />
          <span className="circle circle-5" />
          <span className="circle circle-4" />
          <span className="circle circle-3" />
          <span className="circle circle-2" />
          <span className="circle circle-1" />
        </span>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
