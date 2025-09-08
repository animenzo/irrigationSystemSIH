// {
//   "name": "Farm",
//   "type": "object",
//   "properties": {
//     "name": {
//       "type": "string",
//       "description": "Name of the farm"
//     },
//     "size_acres": {
//       "type": "number",
//       "description": "Size of farm in acres"
//     },
//     "location": {
//       "type": "string",
//       "description": "Farm location"
//     },
//     "current_crop": {
//       "type": "string",
//       "enum": [
//         "wheat",
//         "rice",
//         "corn",
//         "tomato",
//         "potato",
//         "sugarcane",
//         "cotton"
//       ],
//       "description": "Currently planted crop"
//     },
//     "owner_id": {
//       "type": "string",
//       "description": "ID of the farm owner"
//     }
//   },
//   "required": [
//     "name",
//     "size_acres",
//     "current_crop"
//   ]
// }