"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface DrawerDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DrawerDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DrawerDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DrawerDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DrawerDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DrawerDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface DrawerDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface DrawerDialogCloseProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function DrawerDialog({ children, ...props }: DrawerDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <Drawer {...props}>{children}</Drawer>;
  }

  return <Dialog {...props}>{children}</Dialog>;
}

function DrawerDialogTrigger({ children, ...props }: DrawerDialogTriggerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerTrigger {...props}>{children}</DrawerTrigger>;
  }

  return <DialogTrigger {...props}>{children}</DialogTrigger>;
}

function DrawerDialogContent({
  children,
  className,
  ...props
}: DrawerDialogContentProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerContent className={cn(className, "pb-3")} {...props}>
        {children}
      </DrawerContent>
    );
  }

  return (
    <DialogContent className={className} {...props}>
      {children}
    </DialogContent>
  );
}

function DrawerDialogHeader({ children, ...props }: DrawerDialogHeaderProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerHeader {...props}>{children}</DrawerHeader>;
  }

  return <DialogHeader {...props}>{children}</DialogHeader>;
}

function DrawerDialogTitle({ children, ...props }: DrawerDialogTitleProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerTitle {...props}>{children}</DrawerTitle>;
  }

  return <DialogTitle {...props}>{children}</DialogTitle>;
}

function DrawerDialogDescription({
  children,
  ...props
}: DrawerDialogDescriptionProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerDescription {...props}>{children}</DrawerDescription>;
  }

  return <DialogDescription {...props}>{children}</DialogDescription>;
}

function DrawerDialogFooter({ children, ...props }: DrawerDialogFooterProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerFooter {...props}>{children}</DrawerFooter>;
  }

  return <DialogFooter {...props}>{children}</DialogFooter>;
}

function DrawerDialogClose({ children, ...props }: DrawerDialogCloseProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerClose {...props}>{children}</DrawerClose>;
  }

  return <DialogClose {...props}>{children}</DialogClose>;
}

export {
  DrawerDialog,
  DrawerDialogTrigger,
  DrawerDialogContent,
  DrawerDialogHeader,
  DrawerDialogTitle,
  DrawerDialogDescription,
  DrawerDialogFooter,
  DrawerDialogClose,
};
