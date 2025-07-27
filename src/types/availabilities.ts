export interface Availabilities{
    [key: string]: any;
   availabilityId:string;
   docId:string,
   slotId:string,
   scheduleId:string,
   date:string;
   availability:boolean,
   unavailabilityReason:string,
   slotName:string,
   startTime:string;
   endTime:string
   createdAt?: Date; // Optional, if you want to track when the slot was created
    updatedAt?: Date; // Optional, if you want to

}
// "availabilityId": "fc5da4ed-53c2-403b-b3aa-56799352446d",
//         "docId": "dd01866f-cbc8-4ad3-ad46-1c778c352122",
//         "slotId": "dc296feb-490b-4679-851c-e1e2d9c8e5d0",
//         "scheduleId": "7f27f8a0-74fe-4018-aa02-a144bc8d30d1",
//         "date": "2025-07-25",
//         "availability": true,
//         "unavailabilityReason": null,
//         "slotName": "Evening Slot",
//         "startTime": "14:00",
//         "endTime": "17:00"