OFFLINE COMPUTE GRID
COMPLETE MOBILE APP UI/UX DESIGN SYSTEM — iOS + ANDROID

Design a production-ready, premium, modern, futuristic mobile application UI/UX for an offline decentralized distributed-computing platform called:

"Offline Compute Grid"

The application allows multiple:

Laptops
Desktop PCs
Raspberry Pis
Android devices
Other local computing devices

to collaborate over a Local Area Network (LAN) and process computational tasks without requiring internet connectivity.

Create the complete mobile product for both iOS and Android inside one Figma project.

The iOS and Android versions must feel like the same product and brand, while respecting native platform conventions.

01 — CORE DESIGN DIRECTION

The previous dark/neon visual style is completely replaced.

Use:

LIGHT + MINIMAL + PREMIUM + FUTURISTIC + ENTERPRISE

The UI should feel inspired by the design quality of:

Linear
Raycast
Notion
Vercel
Tailscale
Grafana
GitHub
Warp

But do NOT copy any existing product.

Create an original visual identity for Offline Compute Grid.

The application should feel:

Clean
Intelligent
Technical
Reliable
Private
Fast
Professional
Developer-focused
Enterprise-ready
Offline-first
Minimal
Futuristic

Avoid:

Dark mode
Excessive gradients
Excessive glassmorphism
Neon-heavy interfaces
Excessive shadows
Cartoon graphics
Cluttered dashboards
Generic admin-dashboard appearance
02 — MOBILE DESIGN TARGETS

Design for:

iPhone

Primary frame:

390 × 844

Also support:

375 × 812

393 × 852

430 × 932

Android

Primary frame:

412 × 915

Also support:

360 × 800

Use responsive Auto Layout and constraints.

Do not simply resize one frame.

Design reusable responsive components that adapt between iOS and Android.

03 — PLATFORM DESIGN APPROACH

Create one shared design system but create platform-specific behavior where appropriate.

iOS

Use:

iOS-style navigation
Safe areas
Large titles where appropriate
Bottom sheets
Native-feeling segmented controls
Swipe gestures
iOS-style confirmation dialogs
Smooth transitions
SF Symbols-inspired spacing while still using Lucide Icons where appropriate
Haptic-feedback annotations in prototype notes
Android

Use:

Material-inspired interaction patterns
Android navigation conventions
Bottom sheets
Snackbar notifications
Floating Action Button
Android-style dialogs
Gesture navigation safe zones
Ripple interactions
Adaptive layouts

IMPORTANT:

Do NOT make iOS and Android look like two unrelated applications.

Both must share:

Colors

Typography

Branding

Cards

Icons

Charts

Status system

Navigation hierarchy

Content structure

Component language

04 — LIGHT COLOR SYSTEM

Use this exact light palette.

Background

Primary:

#F7F9FC

Secondary:

#F1F4F9

Surface

#FFFFFF

Elevated Surface

#FBFCFE

Sidebar / Navigation

#FFFFFF

Border

#E6EAF0

Primary Text

#111827

Secondary Text

#667085

Muted Text

#98A2B3

Primary Brand

#4F6FFF

Secondary Brand

#7C5CFC

Success

#10B981

Warning

#F59E0B

Danger

#EF4444

Information

#0EA5E9

Soft backgrounds:

Blue:

#EEF3FF

Purple:

#F3F0FF

Green:

#ECFDF5

Orange:

#FFF7ED

Red:

#FEF2F2

Cyan:

#ECFEFF

05 — TYPOGRAPHY

Use:

Inter

for the entire application.

Typography:

Display:

32px / Bold

Screen Heading:

26–30px / SemiBold

Section Heading:

18–20px / SemiBold

Card Heading:

15–17px / SemiBold

Body:

14–16px / Regular

Caption:

12–13px

Technical Data:

Monospace font.

Use monospace for:

IP addresses

Hostnames

Task IDs

Ports

Logs

API keys

System information

Maintain excellent readability and hierarchy.

06 — DESIGN TOKENS

Create Figma Variables.

Spacing:

4

8

12

16

20

24

32

40

48

64

Corner radius:

8

12

16

20

24

32

Touch targets:

Minimum 44 × 44px.

Mobile cards:

16–20px radius.

Buttons:

12–14px radius.

Inputs:

12–14px radius.

07 — GLOBAL MOBILE UI

Create reusable:

App Header

Large Title Header

Compact Header

Bottom Navigation

Floating Action Button

Search Bar

Cards

Metric Cards

Device Cards

Task Cards

File Cards

Notification Cards

Status Badges

Buttons

Inputs

Dropdowns

Bottom Sheets

Dialogs

Toast

Snackbar

Tabs

Segmented Controls

Progress Bars

Charts

Tables

Empty States

Error States

Skeleton Loaders

08 — APP BRANDING

Logo:

Create a minimal connected-node/grid symbol.

Brand:

Offline Compute Grid

Brand concept:

Multiple devices connected together and sharing computing power.

The logo should be simple enough to work as:

App icon

Splash screen

Header logo

Notification icon

Favicon

09 — APP ICON

Create an iOS and Android app icon.

Minimal network/grid symbol.

Use:

Primary blue

Purple accent

White background

Simple geometry.

No text.

Create:

iOS app icon

Android adaptive icon

10 — SPLASH SCREEN

Create native-style splash screens.

Center:

Offline Compute Grid logo

Below:

"Distributed Computing Without the Cloud"

Background:

#F7F9FC

Add extremely subtle blue/purple gradient.

After splash:

→ Authentication

11 — AUTHENTICATION

Create a complete authentication experience.

Flow:

Splash

→ Login

→ Dashboard

Also:

Forgot Password

Reset Password

Create Account

Email Verification

Account Created

Offline Authentication

Login Error

Login Loading

Login Success

12 — MOBILE LOGIN SCREEN

Frame:

390 × 844

Create a premium mobile authentication page.

Background:

#F7F9FC

At top:

Offline Compute Grid logo

Small decentralized network illustration.

Show:

Master Node

Laptop

Desktop

Raspberry Pi

Android Device

Worker nodes

Use subtle blue/purple connection lines.

Do not make the illustration too large.

13 — LOGIN CONTENT

Heading:

"Welcome back"

Subtitle:

"Sign in to your compute grid"

Email:

"Email address"

Placeholder:

"you@example.com"

Password:

"Password"

Include eye icon.

Below:

Remember me

Forgot password?

Primary button:

"Sign In"

Divider:

"OR"

Secondary button:

"Continue with Google"

Bottom:

"Don't have an account?"

"Create account"

14 — LOGIN STATUS

Display LAN status:

● LAN Ready

or

○ Network unavailable

This reinforces that the application works through local networking.

15 — LOGIN STATES

Create frames for:

Default

Focused

Invalid Email

Wrong Password

Empty Fields

Loading

Success

Offline

Network Error

For loading:

Button:

"Signing in..."

For success:

"Welcome back"

Then transition to Dashboard.

16 — FORGOT PASSWORD

Screen:

"Reset your password"

Description:

"Enter your email address and we'll send instructions to reset your password."

Email input.

Button:

"Send reset link"

Link:

"Back to login"

Success state:

"Check your email"

17 — CREATE ACCOUNT

Screen:

"Create your account"

Fields:

Full Name

Email

Password

Confirm Password

Organization

Terms checkbox

Button:

"Create Account"

Google button.

Bottom:

"Already have an account?"

"Sign in"

18 — EMAIL VERIFICATION

Screen:

"Verify your email"

Description:

"We've sent a verification code to your email."

Create:

6-digit OTP input.

Button:

"Verify Email"

Resend:

"Resend Code"

Countdown:

"Resend in 00:42"

19 — ACCOUNT CREATED

Illustration:

Connected network becoming active.

Heading:

"You're all set"

Description:

"Your Offline Compute Grid workspace is ready."

Buttons:

"Open Dashboard"

"Configure Devices"

20 — MAIN MOBILE NAVIGATION

Use five primary destinations:

Dashboard

Devices

Tasks

Files

Settings

Bottom navigation should remain consistent throughout the application.

Use:

White background

Thin top border

Subtle shadow

Safe-area padding.

Active item:

Primary blue #4F6FFF

Inactive:

#667085

21 — DASHBOARD

Create the primary mobile dashboard.

Header:

"Offline Compute Grid"

LAN status:

"LAN Connected"

Profile avatar.

Optional notification icon.

Greeting:

"Good morning"

Title:

"Compute Overview"

22 — DASHBOARD METRICS

Create horizontally scrollable metric cards.

Cards:

Connected Devices

CPU Cores

Available RAM

Running Tasks

Processing Speed

Storage

Example:

Connected Devices

8

+2 today

CPU:

32 Cores

RAM:

48 GB

Running Tasks:

4

Processing:

128.4 GB/s

23 — MASTER NODE CARD

Large card:

Master Node

Online

Hostname

IP Address

CPU

RAM

Storage

Uptime

Workers

Use green status indicator.

Add subtle pulse animation.

24 — NETWORK TOPOLOGY

Create an interactive mobile network visualization.

Center:

Master Node

Around:

Worker nodes.

Devices:

Laptop

Desktop

Raspberry Pi

Android

Show connection lines.

Active tasks:

Animated particles.

Tap a node:

Open Device Details.

Long press:

Quick actions.

Statuses:

Online

Processing

Idle

Offline

Connecting

25 — CURRENT TASK

Large card:

Current Processing Job

Task name

Task type

Progress

72%

Workers:

6

Processing Speed

ETA

Progress bar.

Example:

"4K Video Processing"

"72%"

"ETA 04:32"

26 — PERFORMANCE SUMMARY

Cards:

CPU

Memory

Network

Storage

Temperature

Use small animated charts.

Chart controls:

1m

5m

15m

1h

24h

27 — DEVICES

Bottom navigation:

Devices.

Header:

"Connected Devices"

Actions:

Search

Filter

Auto Discover

Network Scanner

28 — DEVICE LIST

Create responsive device cards.

Each card:

Device icon

Device Name

Role

Online indicator

IP

Hostname

CPU

RAM

Storage

Battery

Network Speed

OS

Last Heartbeat

Ping

Current Task

Status

Tap:

→ Device Details

29 — DEVICE DETAIL

Create a full-screen detail page.

Header:

Back

Device name

More menu

Show:

Online

IP Address

Hostname

Operating System

CPU

RAM

Storage

Battery

Temperature

Network

Ping

Uptime

Current Task

Performance charts

Task history

Heartbeat history

30 — DEVICE ACTIONS

Bottom sheet:

View Details

Restart

Disconnect

Pause Worker

Resume Worker

Remove Device

Use confirmation dialog for destructive actions.

31 — AUTO DISCOVERY

Create a device discovery screen.

Header:

"Discover Devices"

Animated scanning illustration.

Show:

Scanning local network...

Devices found:

Laptop

Desktop

Raspberry Pi

Android

Buttons:

Add Device

Ignore

Refresh

Network status:

LAN Connected

32 — NETWORK SCANNER

Create scanner interface.

Show:

Network

IP Range

Port

Scan

Results.

Use technical monospace typography.

33 — TASK MANAGER

Header:

"Tasks"

Create segmented tabs:

Pending

Running

Completed

Failed

Cancelled

Search.

Filter.

Sort.

34 — TASK CARDS

Each task card:

Task name

Task type

Priority

Progress

Assigned devices

Remaining time

Created by

File size

Created time

Status.

Actions:

Pause

Resume

Cancel

Retry

35 — TASK SWIPE ACTIONS

iOS:

Swipe left:

Cancel

Swipe right:

Resume / Pause

Android:

Use swipe actions with Material-style feedback.

Tap:

Open Task Details.

36 — TASK DETAIL

Show:

Task name

Status

Priority

Task type

Progress

ETA

Assigned workers

CPU usage

RAM usage

Input file

Output file

Created time

Task logs

Task history

Actions:

Pause

Resume

Cancel

Retry

37 — CREATE TASK

Use a mobile multi-step workflow.

Step indicator:

1 Upload

2 Configure

3 Workers

4 Review

5 Submit

38 — UPLOAD TASK

Large drag/drop-style upload area adapted for mobile.

Button:

"Choose File"

Support:

Images

Videos

Documents

Python Scripts

Compression Tasks

Also:

Take Photo

Choose from Files

Choose from Gallery

39 — TASK CONFIGURATION

Fields:

Task Type

Split Size

Priority

Worker Selection

Estimated Runtime

Resource Requirements

Advanced Options

Use bottom sheets for selections.

40 — WORKER SELECTION

Show worker cards with checkboxes.

Each worker:

Device

CPU

RAM

Current load

Status

Estimated contribution

Button:

Select All

Auto Select

41 — TASK REVIEW

Show summary:

File

Task type

Split size

Priority

Workers

Estimated runtime

Expected resources

Primary button:

"Submit Task"

42 — TASK CREATED

Success screen:

"Task submitted"

Show:

Task ID

Workers assigned

Estimated runtime

Progress:

0%

Button:

"View Task"

43 — FILE MANAGER

Bottom navigation:

Files.

Header:

"Files"

Search

Upload

New Folder

Grid/List toggle.

44 — FILE CATEGORIES

Folders:

Uploads

Processed Files

Downloads

Shared

Trash

45 — FILE CARDS

Show:

File icon

Name

Type

Size

Modified

Status

Owner

Use grid and list modes.

Tap:

Preview

Long press:

Actions.

46 — FILE ACTIONS

Bottom sheet:

Preview

Download

Share

Rename

Move

Delete

Properties

Use confirmation for delete.

47 — FILE PREVIEW

Create preview page.

Show:

File preview

File name

Type

Size

Created

Modified

Status

Actions:

Download

Share

Delete

48 — PERFORMANCE MONITOR

Create mobile performance dashboard inspired by Grafana but significantly cleaner.

Title:

"Performance"

Live indicator:

"Live • Updated 1s ago"

49 — RESOURCE CARDS

CPU

Memory

Disk

Network

Temperature

Power

Task Throughput

Node Availability

50 — PERFORMANCE CHARTS

Create:

CPU chart

Memory chart

Disk chart

Network chart

Temperature chart

Power chart

Task throughput chart

Use:

1m

5m

15m

1h

24h

Charts should animate smoothly.

51 — NODE COMPARISON

Create a horizontally scrollable comparison list.

Columns:

Node

CPU

RAM

Network

Temperature

Tasks

Status

Allow sorting.

52 — PERFORMANCE HEATMAP

Create mobile-friendly heatmap.

Rows:

Worker nodes.

Columns:

Time.

Color intensity:

Low

Medium

High

Critical

Include legend.

53 — LOGS

Create developer-focused mobile log interface.

Header:

"Logs"

Search.

Filters:

INFO

WARNING

ERROR

SUCCESS

DEBUG

54 — LOG VIEW

Each log:

Timestamp

Worker

Task ID

Level

Message

Use monospace font.

Use small colored indicators.

Avoid huge colored backgrounds.

Actions:

Export

Pause

Auto Scroll

Clear

55 — NOTIFICATIONS

Create notification center.

Notifications:

Task completed

Worker disconnected

Worker joined

Task failed

Storage full

Network disconnected

Each:

Icon

Title

Description

Timestamp

Unread indicator

56 — NOTIFICATION BEHAVIOR

iOS:

Use notification screen and native-style alert patterns.

Android:

Use notification screen + snackbar patterns.

In-app notifications should remain visually consistent.

57 — SETTINGS

Create mobile settings interface.

Categories:

General

Appearance

Network

Security

Worker Configuration

Notifications

Task Scheduling

Database

Backup

API

About

58 — GENERAL SETTINGS

Options:

Language

Auto Discovery

Heartbeat Interval

Default Task Priority

Default Worker Selection

Confirm Destructive Actions

59 — NETWORK SETTINGS

Show:

LAN Status

Network Name

IP Address

Subnet

Master Node

Port

Discovery

Heartbeat

Connection Timeout

60 — SECURITY SETTINGS

Show:

Authentication

Change Password

Two-Factor Authentication

Active Sessions

API Keys

Biometric Login

App Lock

61 — WORKER CONFIGURATION

Options:

Enable Worker

Maximum CPU Usage

Maximum RAM Usage

Battery Threshold

Allow Mobile Processing

Auto Accept Tasks

Worker Priority

62 — TASK SCHEDULING

Options:

Enable Scheduling

Queue Priority

Maximum Concurrent Tasks

CPU Limit

RAM Limit

Preferred Workers

63 — DATABASE / BACKUP

Show:

Database Status

Last Backup

Backup Size

Backup Location

Automatic Backup

Export Database

Restore Database

64 — API

Show:

API Status

API Endpoint

Port

API Keys

Generate Key

Revoke Key

Copy Key

Use secure masked fields.

65 — PROFILE

Create profile screen.

Avatar

Name

Role

Email

Organization

Recent Activity

API Keys

Security

Sessions

Logout

66 — SECURITY / SESSIONS

Show:

Current Device

Other Devices

Last Active

IP

Platform

Session status

Action:

Sign out

Also include:

Change Password

Biometric authentication

Two-factor authentication

67 — EMPTY STATES

Create beautiful illustrations and states for:

No Devices

No Files

No Tasks

No Notifications

Network Offline

Server Offline

No Workers

No Search Results

Example:

"No devices connected"

"Discover devices on your local network to start distributing tasks."

Button:

"Auto Discover"

68 — ERROR STATES

Create:

404

500

Network Error

Offline Mode

Server Offline

Task Failed

File Upload Failed

Device Connection Failed

Use minimal network-themed illustrations.

Buttons:

Retry

Return Home

69 — OFFLINE MODE

This is an important product feature.

Create a dedicated offline state.

Header:

"Offline Mode"

Message:

"Internet connection unavailable. Your local compute grid can continue operating over LAN."

Show:

LAN Connected

Master Node Online

Workers Online

Tasks Running

Local Storage

Use green status for local connectivity.

Make it clear that:

No cloud connection is required for local processing.

70 — SERVER OFFLINE

Create:

"Master Node Offline"

Description:

"The master node is currently unavailable."

Buttons:

Retry Connection

Network Scanner

Switch Master

71 — SKELETON LOADING

Create skeleton states for:

Dashboard

Devices

Tasks

Files

Performance

Logs

Use subtle shimmer animation.

Do not make skeletons visually heavy.

72 — TOAST / SNACKBAR

Create reusable notifications.

Examples:

"Device connected"

"Task created"

"Task completed"

"File uploaded"

"Device disconnected"

"Settings saved"

"Connection lost"

Use:

iOS toast/banner style

Android snackbar style

73 — BOTTOM SHEETS

Use bottom sheets for:

Device actions

Task actions

File actions

Filters

Sort

Worker selection

Task type

Priority

Settings selection

Bottom sheets should have:

Rounded top corners

Drag handle

Clear hierarchy

Primary/secondary actions.

74 — MODALS

Create confirmation dialogs for:

Disconnect device

Restart device

Delete file

Cancel task

Reset settings

Delete API key

Logout

Use clear destructive-action styling.

75 — SEARCH

Create global mobile search.

Search across:

Devices

Tasks

Files

Logs

Settings

Use:

Search field

Recent searches

Suggestions

Results categories.

76 — FILTER SYSTEM

Create reusable filter bottom sheet.

Filters:

Status

Priority

Device

Task Type

Date

CPU

RAM

Storage

Use:

Checkbox

Radio

Range slider

Clear All

Apply

77 — MOBILE DASHBOARD GESTURES

Prototype:

Pull to refresh

Swipe cards

Horizontal metric scrolling

Tap network node

Long press device

Swipe task actions

Bottom sheet drag

Chart horizontal scrolling

78 — MICRO INTERACTIONS

Use subtle premium animations.

Button:

Ripple/press

Card:

Small elevation change

Status:

Soft pulse

Network:

Animated particles

Chart:

Animated line drawing

Progress:

Smooth transition

Page:

Fade/slide

Bottom sheet:

Spring-like movement

Loading:

Soft shimmer

Keep animations professional.

79 — HAPTIC FEEDBACK

Add prototype annotations for:

Successful task

Device connected

Device disconnected

Task completed

Delete confirmation

Button success

Pull-to-refresh

Use subtle platform-appropriate haptics.

80 — ACCESSIBILITY

Design for accessibility.

Ensure:

Strong text contrast

44px minimum touch targets

Readable typography

Clear focus states

Screen reader-friendly labels

Do not rely solely on color.

For statuses use:

Icon + text + color.

81 — DATA VISUALIZATION

Charts must be clean and mobile optimized.

Avoid unnecessary grid lines.

Use:

Blue = primary metric

Purple = secondary metric

Green = healthy

Orange = warning

Red = critical

Charts should have:

Tooltips

Legend

Time filter

Animated transitions.

82 — NETWORK VISUALIZATION

Make the network visualization a signature part of the application.

Master node:

Blue/purple gradient ring.

Worker nodes:

White circular/card nodes.

Connection:

Thin gray/blue lines.

Active transfer:

Animated blue particles.

Processing:

Soft blue glow.

Healthy:

Green indicator.

Offline:

Gray.

Error:

Red.

83 — APP ARCHITECTURE

Create the following mobile screen structure:

AUTH

Splash

Login

Create Account

Forgot Password

Reset Password

Email Verification

Account Created

MAIN

Dashboard

Devices

Device Detail

Network Discovery

Task Manager

Task Detail

Create Task

Task Review

Files

File Preview

Performance

Logs

Notifications

Settings

Profile

Security

Sessions

SYSTEM

Offline Mode

Server Offline

404

500

Network Error

Empty States

Loading States

84 — FIGMA FILE STRUCTURE

Create these Figma pages:

01 — Foundations

02 — Design Tokens

03 — Components

04 — Authentication

05 — Dashboard

06 — Devices

07 — Tasks

08 — Create Task

09 — Files

10 — Performance

11 — Logs

12 — Notifications

13 — Settings

14 — Profile

15 — Empty States

16 — Error States

17 — iOS Screens

18 — Android Screens

19 — Prototype Flows

20 — App Icon & Branding

85 — COMPONENT VARIANTS

Create variants for:

Buttons:

Default

Pressed

Disabled

Loading

Success

Danger

Inputs:

Default

Focused

Filled

Error

Disabled

Cards:

Default

Selected

Loading

Disabled

Device:

Online

Idle

Processing

Warning

Offline

Task:

Pending

Running

Completed

Failed

Cancelled

Network:

Connected

Connecting

Offline

Error

86 — FIGMA COMPONENT SYSTEM

Use:

Auto Layout

Components

Variants

Figma Variables

Constraints

Responsive resizing

Component properties

Interactive components

Do not manually recreate identical elements.

Make the entire design system reusable for future development.

87 — PROTOTYPE FLOW

Create a complete clickable prototype.

Flow:

Splash
↓
Login
↓
Dashboard
↓
Devices
↓
Device Detail
↓
Network Discovery
↓
Tasks
↓
Task Detail
↓
Create Task
↓
Upload
↓
Configure
↓
Worker Selection
↓
Review
↓
Task Created
↓
Files
↓
File Preview
↓
Performance
↓
Logs
↓
Notifications
↓
Settings
↓
Profile

Include back navigation throughout.

88 — IOS NAVIGATION

Use:

Tab Bar / Bottom Navigation

Primary:

Dashboard

Devices

Tasks

Files

Settings

Use navigation stacks for detail screens.

Use swipe-back behavior.

Use modal sheets where appropriate.

Respect iOS safe areas.

89 — ANDROID NAVIGATION

Use:

Bottom Navigation

Primary:

Dashboard

Devices

Tasks

Files

Settings

Use:

Back navigation

Bottom sheets

Dialogs

Snackbar

FAB

Respect Android gesture/navigation safe areas.

90 — IOS VS ANDROID DIFFERENCES

Keep visual identity identical but allow:

iOS:

More native sheet behavior

Swipe-back

Large navigation titles

iOS-style alerts

Android:

Material-style ripple

FAB

Snackbar

Android-style dialogs

Navigation behavior

Do not duplicate completely separate designs.

91 — FINAL VISUAL GOAL

The final app should look like:

Linear + Tailscale + Vercel + Grafana

reimagined as a light-mode mobile distributed-computing platform.

It should communicate:

"Your devices."

"Your network."

"Your compute."

"No cloud required."

The product must feel:

Premium

Minimal

Technical

Trustworthy

Fast

Modern

Intelligent

Private

Enterprise-grade.

92 — FINAL FIGMA AI INSTRUCTION

Generate the complete high-fidelity iOS + Android mobile application UI/UX in one connected Figma project.

Do not create only a few representative screens.

Create the complete product experience including:

Authentication

Dashboard

Network visualization

Connected Devices

Device Details

Auto Discovery

Network Scanner

Task Manager

Task Details

Create Task

Worker Selection

File Manager

File Preview

Performance Monitor

Logs

Notifications

Settings

Profile

Security

Sessions

Offline Mode

Server Offline

Empty States

Error States

Loading States

All components

All interaction states

All responsive states.

Use realistic sample data.

Use reusable components.

Use Auto Layout.

Use Figma Variables.

Use responsive constraints.

Create interactive prototype connections.

Create both iOS and Android variants.

Keep the same brand, design system, color palette, typography and UX architecture across both platforms.

The final result must be presentation-ready, developer-friendly, visually consistent, and realistic enough to hand off to a development team.