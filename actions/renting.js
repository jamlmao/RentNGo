"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';


