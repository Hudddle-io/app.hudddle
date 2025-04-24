import GoLiveCounter from '@/components/shared/golive-components/golive-counter';
import Notificationbar from '@/components/shared/notifcation-bar';
import Sidebar from '@/components/shared/sidebar';
import React from 'react'

export default function TasksLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <main className="w-full h-screen grid grid-cols-6">
      <Sidebar />
      <div className="col-span-5 overflow-scroll scroll-hidden h-screen">
        <GoLiveCounter />
        {children}
      </div>
 
    </main>
  )
}



{/* <Dialog>
<DialogTrigger asChild>
  <Button variant="outline" className="rounded-[38px] flex flex-row space-x-2" size="lg">
    <Image src={filter} alt="" width={18} height={18}/>
    <h1 className="text-[#42526ECC] text-[14px] font-light">Filter</h1>
      </Button>
</DialogTrigger>
<DialogContent className="py-12 px-9">
  <DialogHeader>
    <DialogTitle className="text-[36px] font-medium leading-[120%] text-[#42526E]">Create Task</DialogTitle>
    <DialogDescription>
    Keep up with your everyday task and schedules. Fill out these forms accurately
    </DialogDescription>
  </DialogHeader>
  <div className="flex flex-row items-center space-x-2">
      <h1 className="text-[#42526E] text-[15px]">Recurring Task? </h1>
      <div>
      <RadioGroup defaultValue="yes" className="flex flex-row space-x-3">
      <div className="flex items-center space-x-1 text-[#42526E]">
      <RadioGroupItem value="yes" id="r2" />
      <Label htmlFor="r2 ">Yes</Label>
      </div>
      <div className="flex items-center space-x-1 text-[#42526E]">
      <RadioGroupItem value="no" id="r3" />
      <Label htmlFor="r3 ">No</Label>
      </div>
      </RadioGroup>
      </div>
  </div>
  <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
      <label>Task name</label>
      <Input type="text" placeholder="Prototype the finance app " className="h-[55px] w-full"/>
      </div>
      <div className="flex flex-col gap-1">
      <label>Task duration</label>
      <Input type="text" placeholder="Prototype the finance app " className="h-[55px] w-full"/>
      </div>
      <div className="flex flex-col gap-1">
      <label>Task category</label>
      <Input type="text" placeholder="Prototype the finance app " className="h-[55px] w-full"/>
      </div>
      <div className="flex flex-col gap-1">
      <label>Task tool</label>
      <Input type="text" placeholder="Prototype the finance app " className="h-[55px] w-full"/>
      </div>
  </div>
  <DialogFooter>
    <Button type="submit">Save changes</Button>
  </DialogFooter>
</DialogContent>
          </Dialog> */}
