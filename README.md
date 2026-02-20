# EduBridge - University Attendance Management System

A modern QR-based attendance tracking system built for universities, starting with University of Port Harcourt.

## Features

- 📱 **QR Code Attendance** - Students scan QR codes to mark attendance
- 🔴 **Live Updates** - Real-time attendance tracking with 3-second polling
- 📊 **Analytics Dashboard** - Comprehensive attendance statistics and reports
- 📥 **CSV Export** - Download attendance records for any session
- 👥 **Role-Based Access** - Different views for Students, Course Reps, and Lecturers
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **UI:** shadcn/ui + Tailwind CSS v4
- **QR Code:** react-qr-code + html5-qrcode
- **Styling:** Tailwind CSS with custom #261CC1 brand color

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/edubridge.git
cd edubridge
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/edubridge"
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Usage

### For Lecturers/Course Reps

1. Navigate to `/attendance`
2. Select session date
3. Click "Generate QR Code"
4. Display QR code for students to scan
5. View live attendance updates
6. Export attendance to CSV
7. View analytics at `/reports`

### For Students

1. Navigate to `/attendance`
2. Enter your details (Name, Email, Matric Number)
3. Click "Continue to Scanner"
4. Scan the lecturer's QR code
5. Receive confirmation

## Project Structure

```
edubridge/
├── app/
│   ├── api/
│   │   └── attendance/
│   │       ├── mark/route.ts      # Mark attendance API
│   │       ├── list/route.ts      # List attendees API
│   │       ├── export/route.ts    # Export CSV API
│   │       └── stats/route.ts     # Statistics API
│   ├── attendance/                # Attendance page
│   ├── reports/                   # Reports page
│   ├── dashboard/                 # Dashboard
│   └── ...
├── components/
│   ├── QRGenerator.tsx           # QR code generator
│   ├── QRScanner.tsx             # QR code scanner
│   ├── UserInputForm.tsx         # Student details form
│   ├── AttendanceLiveView.tsx    # Live attendance list
│   ├── AttendanceStats.tsx       # Statistics component
│   └── ...
├── lib/
│   ├── prisma.ts                 # Prisma client
│   └── mock-users.ts             # Mock user system
├── prisma/
│   └── schema.prisma             # Database schema
└── ...
```

## Database Schema

```prisma
model Attendance {
  id          String   @id @default(uuid())
  courseCode  String
  sessionDate DateTime
  userName    String
  userEmail   String
  matNumber   String?
  present     Boolean  @default(true)
  markedAt    DateTime @default(now())
  sessionKey  String

  @@unique([sessionKey, userEmail])
}
```

## API Routes

- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/list` - Get attendees for a session
- `GET /api/attendance/export` - Export attendance to CSV
- `GET /api/attendance/stats` - Get attendance statistics

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/edubridge)

1. Click the button above
2. Add `DATABASE_URL` environment variable
3. Deploy!

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_APP_URL` | No | Your app's public URL |

## Features in Detail

### QR Code Attendance
- Lecturers generate unique QR codes for each session
- Students scan with their mobile camera
- Attendance is marked instantly in the database
- Prevents duplicate entries per session

### Live Updates
- Attendance list refreshes every 3 seconds
- No page reload needed
- See students as they mark attendance in real-time

### Analytics & Reports
- Total sessions held
- Unique students count
- Average attendance per session
- Individual student attendance percentages
- Visual progress bars and status badges

### CSV Export
- One-click download of attendance records
- Includes all student details and timestamps
- Perfect for record-keeping

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub.

## Acknowledgments

- Built for University of Port Harcourt
- Designed for the hackathon
- Powered by Next.js and Prisma

---

Made with ❤️ for better education management
