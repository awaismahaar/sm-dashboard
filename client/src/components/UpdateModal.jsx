import { Button } from "@/components/ui/button";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthUser } from "@/context/useAuthUser";
import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function UpdateModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, setRefetch } = useAuthUser();
  const [data, setData] = useState({
    name: user?.name,
    password: "",
  });

  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    // console.log("UseEffect");
    if (open && user) {
      setData({
        name: user?.name,
        password: "",
      });
    }
  }, [open, user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axiosInstance.put("/update-user", data);
      if (res.data.success) {
        toast.success(res.data.message);
        setOpen(false);
        setRefetch(true);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input
                value={data.name}
                onChange={handleChange}
                id="name-1"
                name="name"
              />
            </Field>
            <Field>
              <Label htmlFor="password-1">New Password</Label>
              <Input
                value={data.password}
                onChange={handleChange}
                type="password"
                id="password-1"
                name="password"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={
                (user?.name === data.name && data.password === "") || isLoading
              }
              type="submit"
            >
              {isLoading ? "Please wait..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateModal;
