/*
ALTER THE ATRIBUTES WILL IMPACT IN TESTS
*/

import { Link } from "../../../domain/link/Link"
import { User } from "../../../domain/user/User"

type DB = {
  users: User[],
  links: Link[]
}

const db: DB = {
  "users": [
    {
      "id": "e66832e3-fa0c-4502-a1a2-752229249a18",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5MTc3YTk1ZC02ZjgzLTQ3OGQtOTY4ZC03M2JlNWEyZGYyNGQiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjczMDM5NDQxfQ.34GbzwQBfMoKG_I8Fd6CvzkrVRdTz-bL_pQGxJ80QXU",
      "firstName": "Igor",
      "lastName": "Hakcolt",
      "email": "test@gmail.com",
      "imageUrl": "https://avatars.githubusercontent.com/u/81633773?v=4",
      "gender": "Male",
      "password": "$2a$10$XNLXy4wl6xfpSh.levPhgehU0WqVgB77cLkKEQ8RZ6VKQCpneeg3e",
      "createdAt": "1856-06-10T18:30:51.876-05:00",
      "verified": true,
    },
    {
      "id": "9177a65d-6f83-478d-954d-10be5a2df24d",
      "refreshToken": null,
      "firstName": "Igor",
      "lastName": "Hakcolt",
      "email": "test@hakcolt.com",
      "imageUrl": null,
      "gender": "Male",
      "password": "$2a$10$ozAIe9m1gTug/4E/2Fe.PeHCMd7KNSHHsDGaY0IyMhDzGxbFLpHxy",
      "createdAt": "1856-06-10T18:30:51.876-05:00",
      "verified": false,
    }
  ],
  "links": [
    {
      "id": "8767a65d-6f83-478d-954d-10be5a2df24d",
      "name": "Linkedin",
      "path": "/linkedin",
      "url": "https://linkedin.com/in/hakcolt",
      "userId": "9177a65d-6f83-478d-954d-10be5a2df24d"
    }
  ]
}

export default db