# 🦁 Kids Gamified Calendar & Task Manager

A fun, gamified web application designed to help children manage their daily tasks using the **Persian (Jalali) Calendar**. It turns chores into a game with XP, Coins, Levels, and real-world Rewards.

![App Screenshot](https://via.placeholder.com/800x400?text=App+Screenshot+Here)

## ✨ Features

- **📅 Jalali Calendar:** Full monthly view with Persian dates and events.
- **🎮 Gamification:**
  - Earn **Coins** and **XP** for completing tasks.
  - Level up system (Beginner to Galaxy Hero).
  - Dynamic **Leaderboard** with simulated competitors.
  - **Achievements** & Badges system.
- **🛒 Rewards Shop:** Kids can spend earned coins to buy real-world rewards (defined by parents).
- **🛡️ Parent Dashboard:** PIN-protected area to manage tasks and approve rewards.
- **✅ Smart Tasks:** Auto-generates daily default tasks (making bed, brushing teeth, etc.).
- **📱 PWA Ready:** Installable on iOS and Android as a native-like app.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Database & Auth:** Supabase (PostgreSQL)
- **Date Handling:** jalaali-js
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A free [Supabase](https://supabase.com) account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/kids-calendar.git
   cd kids-calendar
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Setup:**
    - Create a .env file in the root directory:
   ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```

### 🗄️ Database Setup (Supabase SQL)
  
  To make the app work, run the following SQL commands in your Supabase SQL Editor:
    <details>
      <summary>Click to view SQL Schema</summary>
        ```sql
            -- Enable UUIDs
            create extension if not exists "uuid-ossp";

            -- Users Table
            create table users (
                id uuid references auth.users not null primary key,
                name text unique,
                age integer,
                avatar text,
                coins integer default 0,
                xp integer default 0,
                created_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            
            -- Tasks Table
            create table tasks (
                id uuid default uuid_generate_v4() primary key,
                user_id uuid references auth.users not null,
                title text not null,
                points integer default 10,
                date date not null,
                deadline date,
                is_done boolean default false,
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                unique(user_id, date, title)
            );

            -- Rewards & Redemptions
            create table rewards (
                id uuid default uuid_generate_v4() primary key,
                user_id uuid references auth.users not null,
                title text not null,
                cost integer not null,
                emoji text default '🎁'
            );

            create table redemptions (
                id uuid default uuid_generate_v4() primary key,
                user_id uuid references auth.users not null,
                reward_title text,
                reward_emoji text,
                cost integer,
                is_fulfilled boolean default false,
                created_at timestamp with time zone default timezone('utc'::text, now())
            );

            -- Daily Scores
                create table daily_scores (
                id uuid default uuid_generate_v4() primary key,
                user_id uuid references auth.users not null,
                date date not null,
                total_points integer default 0,
                unique(user_id, date)
            );

            -- Default Tasks & Rewards Tables
                create table default_tasks (id uuid default uuid_generate_v4() primary key, title text, points int);
                create table default_rewards (id uuid default uuid_generate_v4() primary key, title text, cost int, emoji text);

            -- Note: You must also add the Triggers and RPC functions provided in the development process.
        ```
    </details>

- Make sure to disable "Confirm Email" in Supabase Authentication settings.