/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from "./lib/supabaseClient";
import { AuthSession } from "@supabase/supabase-js";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Seeker, Gig, Contact, MarketItem, Transaction, ProofOfPayment } from "./types";
import { 
  INITIAL_CONTACTS, 
  INITIAL_SEEKERS, 
  INITIAL_GIGS, 
  INITIAL_MARKET_ITEMS, 
  INITIAL_MESSAGES 
} from "./data";
import { AdminDashboard } from "./components/AdminDashboard";
import { ChatStatusBar } from "./components/ChatStatusBar";
import {
  MessageCircle,
  Users,
  ShoppingBag,
  Wallet,
  Briefcase,
  Send,
  Paperclip,
  Smile,
  UserPlus,
  Plus,
  User,
  Camera,
  FileText,
  CreditCard,
  Lock,
  ChevronLeft,
  Search,
  Settings,
  Bell,
  Image as ImageIcon,
  X,
  ShieldCheck,
  Award,
  Save,
  Upload,
  MapPin,
  Share2,
  Copy,
  Gift,
  Check,
  Megaphone,
  Heart,
  Volume2,
  PowerOff,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";


const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🤔",
  "😎",
  "😭",
  "😡",
  "👍",
  "❤️",
  "🎉",
  "🔥",
  "✨",
  "👋",
  "🙏",
  "🙌",
  "👀",
  "✨",
  "🌟",
  "💖",
  "😅",
  "😇",
  "😋",
  "😌",
  "😜",
  "😝",
  "🤤",
  "🤫",
  "🤨",
  "🧐",
  "🤪",
  "🤬",
  "🤯",
  "🥳",
  "🥺",
  "🤩",
  "🧐",
  "🤠",
  "🤡",
  "👻",
  "💀",
  "👽",
  "🤖",
  "👾",
  "🎃",
  "😺",
  "😸",
  "😹",
  "😻",
  "😼",
  "😽",
  "🙀",
  "😿",
  "😾",
  "🙈",
  "🙉",
  "🙊",
  "💋",
  "💌",
  "💘",
  "💝",
  "💖",
  "💗",
  "💓",
  "💞",
  "💕",
  "💟",
  "❣️",
  "💔",
  "❤️‍🔥",
  "❤️‍🩹",
  "💯",
  "💢",
  "💥",
  "💫",
  "💦",
  "💨",
  "🕳️",
  "💣",
  "💬",
  "👁️‍🗨️",
  "🗨️",
  "🗯️",
  "💭",
  "💤",
  "👋",
  "🤚",
  "🖐️",
  "✋",
  "🖖",
  "👌",
  "🤌",
  "🤏",
  "✌️",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
  "👈",
  "👉",
  "👆",
  "👇",
  "☝️",
  "👍",
  "👎",
  "✊",
  "👊",
  "🤛",
  "🤜",
  "👏",
  "🙌",
  "👐",
  "🤲",
  "🤝",
  "🙏",
  "✍️",
  "💅",
  "🤳",
  "💪",
  "🦾",
  "🦿",
  "🦵",
  "🦶",
  "👂",
  "🦻",
  "👃",
  "🧠",
  "🫀",
  "🫁",
  "🦷",
  "🦴",
  "👀",
  "👁️",
  "👅",
  "👄",
  "💋",
  "🩸",
  "👶",
  "👧",
  "🧒",
  "👦",
  "👩",
  "🧑",
  "👨",
  "👩‍🦱",
  "🧑‍🦱",
  "👨‍🦱",
  "👩‍🦰",
  "🧑‍🦰",
  "👨‍🦰",
  "👱‍♀️",
  "👱",
  "👱‍♂️",
  "👩‍🦳",
  "🧑‍🦳",
  "👨‍🦳",
  "👩‍🦲",
  "🧑‍🦲",
  "👨‍🦲",
  "🧔‍♀️",
  "🧔",
  "🧔‍♂️",
  "👵",
  "🧓",
  "👴",
  "👲",
  "👳‍♀️",
  "👳",
  "👳‍♂️",
  "🧕",
  "👩‍⚕️",
  "🧑‍⚕️",
  "👨‍⚕️",
  "👩‍🎓",
  "🧑‍🎓",
  "👨‍🎓",
  "👩‍🏫",
  "🧑‍🏫",
  "👨‍🏫",
  "👩‍⚖️",
  "🧑‍⚖️",
  "👨‍⚖️",
  "👩‍🌾",
  "🧑‍🌾",
  "👨‍🌾",
  "👩‍🍳",
  "🧑‍🍳",
  "👨‍🍳",
  "👩‍🔧",
  "🧑‍🔧",
  "👨‍🔧",
  "👩‍🏭",
  "🧑‍🏭",
  "👨‍🏭",
  "👩‍💼",
  "🧑‍💼",
  "👨‍💼",
  "👩‍🔬",
  "🧑‍🔬",
  "👨‍🔬",
  "👩‍💻",
  "🧑‍💻",
  "👨‍💻",
  "👩‍🎤",
  "🧑‍🎤",
  "👨‍🎤",
  "👩‍🎨",
  "🧑‍🎨",
  "👨‍🎨",
  "👩‍✈️",
  "🧑‍✈️",
  "👨‍✈️",
  "👩‍🚀",
  "🧑‍🚀",
  "👨‍🚀",
  "👩‍🚒",
  "🧑‍🚒",
  "👨‍🚒",
  "👮‍♀️",
  "👮",
  "👮‍♂️",
  "🕵️‍♀️",
  "🕵️",
  "🕵️‍♂️",
  "💂‍♀️",
  "💂",
  "💂‍♂️",
  "🥷",
  "👷‍♀️",
  "👷",
  "👷‍♂️",
  "🤴",
  "👸",
  "👳‍♀️",
  "👳",
  "👳‍♂️",
  "👲",
  "🧕",
  "🤵‍♀️",
  "🤵",
  "🤵‍♂️",
  "👰‍♀️",
  "👰",
  "👰‍♂️",
  "🤰",
  "🤱",
  "👩‍🍼",
  "🧑‍🍼",
  "👨‍🍼",
  "👼",
  "🎅",
  "🤶",
  "🧑‍🎄",
  "🦸‍♀️",
  "🦸",
  "🦸‍♂️",
  "🦹‍♀️",
  "🦹",
  "🦹‍♂️",
  "🧙‍♀️",
  "🧙",
  "🧙‍♂️",
  "🧚‍♀️",
  "🧚",
  "🧚‍♂️",
  "🧛‍♀️",
  "🧛",
  "🧛‍♂️",
  "🧜‍♀️",
  "🧜",
  "🧜‍♂️",
  "🧝‍♀️",
  "🧝",
  "🧝‍♂️",
  "🧞‍♀️",
  "🧞",
  "🧞‍♂️",
  "🧟‍♀️",
  "🧟",
  "🧟‍♂️",
  "🙍‍♀️",
  "🙍",
  "🙍‍♂️",
  "🙎‍♀️",
  "🙎",
  "🙎‍♂️",
  "🙅‍♀️",
  "🙅",
  "🙅‍♂️",
  "🙆‍♀️",
  "🙆",
  "🙆‍♂️",
  "💁‍♀️",
  "💁",
  "💁‍♂️",
  "🙋‍♀️",
  "🙋",
  "🙋‍♂️",
  "🧏‍♀️",
  "🧏",
  "🧏‍♂️",
  "🙇‍♀️",
  "🙇",
  "🙇‍♂️",
  "🤦‍♀️",
  "🤦",
  "🤦‍♂️",
  "🤷‍♀️",
  "🤷",
  "🤷‍♂️",
  "💆‍♀️",
  "💆",
  "💆‍♂️",
  "💇‍♀️",
  "💇",
  "💇‍♂️",
  "🚶‍♀️",
  "🚶",
  "🚶‍♂️",
  "👩‍🦯",
  "🧑‍🦯",
  "👨‍🦯",
  "👩‍🦼",
  "🧑‍🦼",
  "👨‍🦼",
  "👩‍🦽",
  "🧑‍🦽",
  "👨‍🦽",
  "🏃‍♀️",
  "🏃",
  "🏃‍♂️",
  "💃",
  "🕺",
  "🕴️",
  "👯‍♀️",
  "👯",
  "👯‍♂️",
  "🧖‍♀️",
  "🧖",
  "🧖‍♂️",
  "🧗‍♀️",
  "🧗",
  "🧗‍♂️",
  "🤺",
  "🏇",
  "⛷️",
  "🏂",
  "🤼‍♀️",
  "🤼",
  "🤼‍♂️",
  "🤸‍♀️",
  "🤸",
  "🤸‍♂️",
  "⛹️‍♀️",
  "⛹️",
  "⛹️‍♂️",
  "🤺",
  "🏇",
  "⛷️",
  "🏂",
  "🤼‍♀️",
  "🤼",
  "🤼‍♂️",
  "🤸‍♀️",
  "🤸",
  "🤸‍♂️",
  "⛹️‍♀️",
  "⛹️",
  "⛹️‍♂️",
];
const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡", "🙏", "🔥"];


interface Reaction {
  emoji: string;
  userIds: string[];
}

interface Message {
  id: number;
  userId?: string;
  text?: string;
  sender: "user" | "other" | "contact";
  fileUrl?: string;
  fileType?: "image" | "video";
  liked?: boolean;
  reactions?: Reaction[];
  contactId?: string;
  createdAt?: string;
}

const MENU_ITEMS = [
  { name: "Chat", icon: MessageCircle },
  { name: "Seekers", icon: Users },
  { name: "GiGs", icon: Briefcase },
  { name: "Market", icon: ShoppingBag },
];

const ADMIN_EMAIL = "21lucihanomatthews@gmail.com";

const TOPUP_OPTIONS = [
  { coins: "50 Coins", price: "R5.00" },
  { coins: "100 Coins", price: "R10.00" },
  { coins: "200 Coins", price: "R20.00" },
  { coins: "500 Coins", price: "R49.99" },
  { coins: "1500 Coins", price: "R99.99" },
];

const PROVINCES = [
  "All Provinces",
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape"
];

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState("All Provinces");
  const [showPromoteModal, setShowPromoteModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [activeTab, setActiveTab] = useState("Seekers");
  const skipUpdate = useRef(false);
  const lastUpdateRef = useRef<string>("");
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'pin-login'>('login');
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authPin, setAuthPin] = useState("");
  const [authTermsAccepted, setAuthTermsAccepted] = useState(false);
  const [isCongratulating, setIsCongratulating] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [walletView, setWalletView] = useState<
    "main" | "topup" | "transfer" | "receive"
  >("main");
  const [topupStep, setTopupStep] = useState<"select" | "payment" | "proof">("select");
  const [selectedTopupOption, setSelectedTopupOption] = useState<
    (typeof TOPUP_OPTIONS)[0] | null
  >(null);
  const [activeChatContactId, setActiveChatContactId] = useState<string | null>(
    null,
  );
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const mapContactFromDb = (row: any): Contact => ({
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    bio: row.bio,
    province: row.province,
    location: row.location,
    picture: row.picture,
    createdAt: row.created_at || row.createdAt
  });

  const mapMessageFromDb = (row: any): Message => ({
    id: row.id,
    text: row.text,
    sender: row.sender,
    liked: row.liked,
    reactions: row.reactions || [],
    contactId: row.contact_id || row.contactId,
    fileUrl: row.file_url || row.fileUrl,
    fileType: row.file_type || row.fileType,
    createdAt: row.created_at || row.createdAt
  });

  const mapMessageToDb = (msg: any) => ({
    user_id: msg.userId,
    text: msg.text,
    sender: msg.sender,
    liked: msg.liked || false,
    reactions: msg.reactions || [],
    contact_id: msg.contactId,
    file_url: msg.fileUrl,
    file_type: msg.fileType
  });

  const mapPaymentFromDb = (row: any): ProofOfPayment => ({
    id: row.id,
    userId: row.user_id || row.userId,
    userName: row.user_name || row.userName,
    amount: Number(row.amount),
    documentUrl: row.document_url || row.documentUrl,
    status: row.status,
    date: row.created_at ? row.created_at.split('T')[0] : (row.createdAt ? row.createdAt.split('T')[0] : (row.date || ''))
  });

  const mapPaymentToDb = (pay: any) => ({
    user_id: pay.userId,
    user_name: pay.userName,
    amount: pay.amount,
    document_url: pay.documentUrl,
    status: pay.status || 'pending'
  });

  const mapTransactionFromDb = (row: any): Transaction => ({
    id: row.id,
    userId: row.user_id || row.userId,
    type: row.type,
    amount: Number(row.amount),
    recipient: row.recipient,
    date: row.created_at ? row.created_at.split('T')[0] : (row.createdAt ? row.createdAt.split('T')[0] : (row.date || ''))
  });

  const mapTransactionToDb = (tx: any) => ({
    user_id: tx.userId,
    type: tx.type,
    amount: tx.amount,
    recipient: tx.recipient
  });

  const mapGigFromDb = (row: any): Gig => ({
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    province: row.province,
    location: row.location,
    category: row.category,
    ownerId: row.owner_id || row.ownerId,
    ownerName: row.owner_name || row.ownerName,
    ownerAvatar: row.owner_avatar || row.ownerAvatar,
    media: row.media || [],
    interestedCount: row.interested_count || row.interestedCount || 0,
    appliedCount: row.applied_count || row.appliedCount || 0
  });

  const mapGigToDb = (gig: any) => ({
    title: gig.title,
    description: gig.description,
    price: gig.price,
    province: gig.province,
    location: gig.location,
    category: gig.category,
    owner_id: gig.ownerId,
    owner_name: gig.ownerName,
    owner_avatar: gig.ownerAvatar,
    media: gig.media || [],
    interested_count: gig.interestedCount || 0,
    applied_count: gig.appliedCount || 0
  });

  const mapMarketItemFromDb = (row: any): MarketItem => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    portfolio: row.portfolio || [],
    type: row.type,
    province: row.province,
    location: row.location,
    ownerId: row.owner_id || row.ownerId,
    ownerName: row.owner_name || row.ownerName,
    interestedCount: row.interested_count || row.interestedCount || 0,
    appliedCount: row.applied_count || row.appliedCount || 0
  });

  const mapMarketItemToDb = (item: any) => ({
    name: item.name,
    description: item.description,
    price: item.price,
    portfolio: item.portfolio || [],
    type: item.type,
    province: item.province,
    location: item.location,
    owner_id: item.ownerId,
    owner_name: item.ownerName,
    interested_count: item.interestedCount || 0,
    applied_count: item.appliedCount || 0
  });

  const mapSeekerFromDb = (row: any): Seeker => ({
    id: row.id,
    userId: row.user_id || row.userId,
    name: row.name,
    bio: row.bio,
    location: row.location,
    province: row.province,
    rate: row.rate,
    portfolio: row.portfolio || []
  });

  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseConfigured || !session) return;
      try {
        const { data: contacts, error: contactsError } = await supabase
          .from('contacts')
          .select('*')
          .eq('user_id', session.user.id);
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', session.user.id);
        
        if (contactsError) {
          if (contactsError.code === '42703' || contactsError.code === 'PGRST205') {
            console.warn('Note: The "contacts" table or its required columns do not exist in your Supabase database. Falling back to default contacts. Please run schema.sql in your Supabase SQL editor to set up the schema properly.');
          } else {
            console.warn('Warning fetching contacts:', contactsError);
          }
          setContacts(INITIAL_CONTACTS);
        } else {
          setContacts(contacts && contacts.length > 0 ? contacts.map(mapContactFromDb) : INITIAL_CONTACTS);
        }

        if (messagesError) {
          if (messagesError.code === '42703' || messagesError.code === 'PGRST205') {
            console.warn('Note: The "messages" table or its required columns do not exist in your Supabase database. Falling back to default messages. Please run schema.sql in your Supabase SQL editor to set up the schema properly.');
          } else {
            console.warn('Warning fetching messages:', messagesError);
          }
          setMessages(INITIAL_MESSAGES);
        } else {
          setMessages(messages && messages.length > 0 ? messages.map(mapMessageFromDb) : INITIAL_MESSAGES);
        }
      } catch (err) {
        console.warn('Warning in fetchData:', err);
        setContacts(INITIAL_CONTACTS);
        setMessages(INITIAL_MESSAGES);
      }
    }

    async function fetchPayments() {
      if (!isSupabaseConfigured || !session) return;
      try {
        let query = supabase.from('proofs_of_payment').select('*');
        
        // If admin, don't filter by user_id
        if (session.user.email !== ADMIN_EMAIL) {
          query = query.eq('user_id', session.user.id);
        }
        
        const { data, error } = await query;
        if (error) {
          if (error.code === '42703' || error.code === 'PGRST205') {
            console.warn('Note: The "proofs_of_payment" table or its required columns do not exist in your Supabase database. Please run schema.sql in your Supabase SQL editor to set up the schema properly.');
          } else {
            console.warn('Warning fetching payments:', error);
          }
        } else {
          setPayments(data ? data.map(mapPaymentFromDb) : []);
        }
      } catch (err) {
        console.warn('Warning in fetchPayments:', err);
      }
    }

    async function fetchTransactions() {
      if (!isSupabaseConfigured || !session) return;
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', session.user.id);
        if (error) {
          if (error.code === 'PGRST205' || error.code === '42703') {
            console.warn('Note: The "transactions" table or its required columns do not exist yet in your Supabase database. Please run schema.sql in your Supabase SQL editor to create/update it.');
          } else {
            console.warn('Warning fetching transactions:', error);
          }
        } else {
          setTransactions(data ? data.map(mapTransactionFromDb) : []);
        }
      } catch (err) {
        console.warn('Warning in fetchTransactions:', err);
      }
    }

    if (session) {
      fetchData();
      fetchPayments();
      fetchTransactions();
    } else {
      setContacts([]);
      setMessages([]);
      setPayments([]);
      setTransactions([]);
      setUserProfile(null);
    }
  }, [session]);
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeBubbleMenu, setActiveBubbleMenu] = useState<number | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: "image" | "video";
  } | null>(null);
  const [activeSeeker, setActiveSeeker] = useState<Seeker | null>(null);
  const [seekers, setSeekers] = useState<Seeker[]>(INITIAL_SEEKERS);

  useEffect(() => {
    async function fetchSeekers() {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase.from('seekers').select('*');
        if (error) {
          console.warn('Warning fetching seekers (will use defaults):', error);
          setSeekers(INITIAL_SEEKERS);
        } else {
          setSeekers(data && data.length > 0 ? data.map(mapSeekerFromDb) : INITIAL_SEEKERS);
        }
      } catch (err) {
        console.warn('Warning in fetchSeekers:', err);
        setSeekers(INITIAL_SEEKERS);
      }
    }
    fetchSeekers();
  }, []);

  useEffect(() => {
    localStorage.setItem("seekers", JSON.stringify(seekers));
  }, [seekers]);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [marketItems, setMarketItems] = useState<MarketItem[]>(INITIAL_MARKET_ITEMS);

  useEffect(() => {
    async function fetchMarketItems() {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase.from('market_items').select('*');
        if (error) {
          console.warn('Warning fetching market items (will use defaults):', error);
          setMarketItems(INITIAL_MARKET_ITEMS);
        } else {
          setMarketItems(data && data.length > 0 ? data.map(mapMarketItemFromDb) : INITIAL_MARKET_ITEMS);
        }
      } catch (err) {
        console.warn('Warning in fetchMarketItems:', err);
        setMarketItems(INITIAL_MARKET_ITEMS);
      }
    }
    fetchMarketItems();
  }, []);
  const [marketCategory, setMarketCategory] = useState<'sale' | 'wanted'>('sale');
  const [marketEntryMode, setMarketEntryMode] = useState<'selection' | 'browsing'>('selection');
  const [isTypingGig, setIsTypingGig] = useState(false);
  const [gigTitle, setGigTitle] = useState('');
  const [gigDesc, setGigDesc] = useState('');
  const [gigBudget, setGigBudget] = useState('');
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isPostingGig, setIsPostingGig] = useState(false);
  const gigTitleRef = useRef<HTMLInputElement>(null);
  const [createProductType, setCreateProductType] = useState<'sale' | 'wanted'>('sale');
  const [activeProduct, setActiveProduct] = useState<MarketItem | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const balance = React.useMemo(() => Number(userProfile?.balance) || 0, [userProfile?.balance]);

  const setBalance = React.useCallback((newBalance: number | ((prev: number) => number)) => {
    setUserProfile((prev: any) => {
      const currentBalance = Number(prev?.balance) || 0;
      const updatedBalance = typeof newBalance === 'function' ? newBalance(currentBalance) : newBalance;
      if (currentBalance === updatedBalance) return prev;
      return { ...prev, balance: updatedBalance };
    });
  }, []);

  const [editProfileForm, setEditProfileForm] = useState<any>({});
  const [onboardingForm, setOnboardingForm] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "1995-05-12",
    face_picture: ""
  });
  const [settingsTab, setSettingsTab] = useState<'notifications' | 'profile' | 'account'>('profile');

  useEffect(() => {
    if (userProfile) {
      setEditProfileForm((prev: any) => {
        // Prevent unnecessary updates if data is identical
        if (JSON.stringify(prev) === JSON.stringify(userProfile)) return prev;
        return userProfile;
      });
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
    } else {
      setEditProfileForm({});
    }
  }, [userProfile]);

  const [payments, setPayments] = useState<ProofOfPayment[]>([]);

  useEffect(() => {
    if (session && payments.length > 0) {
      localStorage.setItem(`payments_${session.user.id}`, JSON.stringify(payments));
    }
  }, [payments, session]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    if (session && transactions.length > 0) {
      localStorage.setItem(`transactions_${session.user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, session]);

  const handleResetAllData = () => {
    const keys = ["balance", "payments", "seekers", "marketItems", "gigs", "messages", "contacts", "userProfile", "clearedMessageIds", "transactions", "admin_online_users", "admin_online_visitors"];
    keys.forEach(key => localStorage.removeItem(key));
    setBalance(0);
    setPayments([]);
    setSeekers([]);
    setMarketItems([]);
    setGigs([]);
    setMessages([]);
    setContacts([]);
    setNotifications([]);
    setTransactions([]);
  };
  const [showWallet, setShowWallet] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [clearedMessageIds, setClearedMessageIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("clearedMessageIds");
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState<
    { id: string; title: string; message: string; time: string; type: string; contactId?: string }[]
  >([]);

  useEffect(() => {
    localStorage.setItem("clearedMessageIds", JSON.stringify(clearedMessageIds));
  }, [clearedMessageIds]);
  const [showLowBalanceAlert, setShowLowBalanceAlert] = useState(false);
  const [showCreateGig, setShowCreateGig] = useState(false);

  useEffect(() => {
    if (showCreateGig) {
      setGigTitle('');
      setGigDesc('');
      setGigBudget('');
      setTimeout(() => gigTitleRef.current?.focus(), 100);
    }
  }, [showCreateGig]);
  const [gigImages, setGigImages] = useState<string[]>([]);
  const [notificationSettings, setNotificationSettings] = useState({
    messages: true,
    gigs: true,
    market: true,
    wallet: true,
    sound: true
  });
  const [activeGig, setActiveGig] = useState<Gig | null>(null);
  const [gigs, setGigs] = useState<Gig[]>(INITIAL_GIGS);

  useEffect(() => {
    async function fetchGigs() {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase.from('gigs').select('*');
        if (error) {
          console.warn('Warning fetching gigs (will use defaults):', error);
          setGigs(INITIAL_GIGS);
        } else {
          setGigs(data && data.length > 0 ? data.map(mapGigFromDb) : INITIAL_GIGS);
        }
      } catch (err) {
        console.warn('Warning in fetchGigs:', err);
        setGigs(INITIAL_GIGS);
      }
    }
    fetchGigs();
  }, []);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProfileLocked, setIsProfileLocked] = useState(true);
  const [pinEntry, setPinEntry] = useState("");
  const [pinError, setPinError] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastClickRef = useRef(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevMessagesLength = useRef(messages.length);
  const prevNotificationsLength = useRef(notifications.length);

  useEffect(() => {
    if (session && isSupabaseConfigured) {
      async function fetchProfile() {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session!.user.id)
            .single();
          
          if (error) {
            if (error.code !== 'PGRST116') {
              console.warn('Warning fetching profile:', error.message, error.details);
            }
          } else if (data) {
            skipUpdate.current = true;
            setUserProfile(data);
            setEditProfileForm(data);
          }
        } catch (err) {
          console.warn('Network issue fetching profile:', err);
        }
      }
      fetchProfile();
    }
  }, [session]);

  useEffect(() => {
    if (session && userProfile && isSupabaseConfigured) {
      if (skipUpdate.current) {
        skipUpdate.current = false;
        return;
      }

      const currentProfileString = JSON.stringify(userProfile);
      if (currentProfileString === lastUpdateRef.current) return;

      async function updateProfile() {
        try {
          // Sanitize object for Supabase update
          // Explicitly define allowed columns to avoid "column not found" schema cache errors
          const allowedColumns = [
            'name', 'email', 'phone', 'dob', 'province', 'location', 'pin', 
            'balance', 'is_verified', 'is_disabled', 'face_picture', 'certificate_document'
          ];
          
          const updateData: any = {};
          allowedColumns.forEach(key => {
            if (userProfile[key] !== undefined) {
              updateData[key] = userProfile[key];
            }
          });
          
          const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', session!.user.id);
            
          if (error) {
            console.error('Error updating profile:', error.message, error.details);
          } else {
            lastUpdateRef.current = currentProfileString;
          }
        } catch (err) {
          console.error('Network error updating profile:', err);
        }
      }
      
      const timer = setTimeout(() => {
        updateProfile();
      }, 1000); // Increased debounce to 1s
      
      return () => clearTimeout(timer);
    }
  }, [userProfile, session]);

  useEffect(() => {
    const handleNotification = (event: any) => {
        setNotifications(prev => [event.detail, ...prev]);
    };
    window.addEventListener('add-notification', handleNotification);
    return () => window.removeEventListener('add-notification', handleNotification);
  }, []);

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      if (notificationSettings.sound) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.sender !== "user") {
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
          audio.play().catch(() => {});
        }
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages, notificationSettings.sound]);

  useEffect(() => {
    if (notifications.length > prevNotificationsLength.current) {
      if (notificationSettings.sound) {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.play().catch(() => {});
      }
    }
    prevNotificationsLength.current = notifications.length;
  }, [notifications, notificationSettings.sound]);

  const startLongPress = (id: number) => {
    longPressTimerRef.current = setTimeout(() => {
      setActiveBubbleMenu(id);
    }, 3000); // 3s as requested
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const toggleReaction = (messageId: number, emoji: string) => {
    if (!session) return;
    const currentUserId = session.user.id;

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;

        // Remove user's existing reaction from any emoji reaction
        const reactions = (m.reactions || [])
          .map((r) => ({
            ...r,
            userIds: r.userIds.filter((id) => id !== currentUserId),
          }))
          .filter((r) => r.userIds.length > 0);

        // Check if the user was toggling off their current reaction
        const wasReaction = (m.reactions || []).find(
          (r) => r.emoji === emoji && r.userIds.includes(currentUserId),
        );

        if (wasReaction) {
          return { ...m, reactions };
        }

        // Add the new reaction
        const existingIndex = reactions.findIndex((r) => r.emoji === emoji);
        if (existingIndex > -1) {
          reactions[existingIndex] = {
            ...reactions[existingIndex],
            userIds: [...reactions[existingIndex].userIds, currentUserId],
          };
        } else {
          reactions.push({ emoji, userIds: [currentUserId] });
        }

        return { ...m, reactions };
      }),
    );
  };

  useEffect(() => {
    if (balance < 100 && notificationSettings.wallet) {
      if (!showLowBalanceAlert) setShowLowBalanceAlert(true);
    } else {
      if (showLowBalanceAlert) setShowLowBalanceAlert(false);
    }
  }, [balance, notificationSettings.wallet, showLowBalanceAlert]);

  const handleSendMessage = async (file?: File) => {
    if (!activeChatContactId || !session) return;
    if (editingMessageId) {
      const updatedText = inputValue;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === editingMessageId ? { ...m, text: updatedText } : m,
        ),
      );
      
      if (isSupabaseConfigured) {
        await supabase
          .from('messages')
          .update({ text: updatedText })
          .eq('id', editingMessageId)
          .eq('user_id', session.user.id);
      }
      setEditingMessageId(null);
    } else if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileType = file.type.startsWith("image/") ? "image" : "video";
      const newMessage = {
        sender: "user",
        fileUrl,
        fileType,
        text: inputValue,
        liked: false,
        reactions: [],
        contactId: activeChatContactId,
        userId: session.user.id
      };

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), ...newMessage } as any,
      ]);

      if (isSupabaseConfigured) {
        // In a real app, you'd upload the file first
        await supabase.from('messages').insert([mapMessageToDb(newMessage)]);
      }
    } else {
      if (inputValue.trim() === "") return;
      const newMessage = {
        text: inputValue,
        sender: "user",
        liked: false,
        reactions: [],
        contactId: activeChatContactId,
        userId: session.user.id
      };

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), ...newMessage } as any,
      ]);

      if (isSupabaseConfigured) {
        await supabase.from('messages').insert([mapMessageToDb(newMessage)]);
      }
    }
    setInputValue("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSendMessage(e.target.files[0]);
    }
  };

  const toggleLike = (id: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, liked: !m.liked } : m)),
    );
  };

  const handleBubbleClick = (id: number) => {
    const now = Date.now();
    if (now - lastClickRef.current < 300) {
      toggleLike(id);
    }
    lastClickRef.current = now;
  };

  const deleteMessage = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingForm.name.trim() || !onboardingForm.phone.trim() || !onboardingForm.email.trim() || !session) {
      alert("Please fill in all the required details (Full Name, Phone Number, and Email Address).");
      return;
    }
    const updated = {
      ...userProfile,
      name: onboardingForm.name,
      phone: onboardingForm.phone,
      email: onboardingForm.email,
      dob: onboardingForm.dob,
      face_picture: onboardingForm.face_picture,
      is_verified: true,
      pin: authPin,
      balance: userProfile?.balance || 500
    };

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updated.name,
          phone: updated.phone,
          email: updated.email,
          dob: updated.dob,
          face_picture: updated.face_picture,
          is_verified: true,
          pin: updated.pin,
          balance: updated.balance
        })
        .eq('id', session.user.id);
      
      if (error) {
        console.error("Error updating profile during onboarding:", error);
      }
    }

    setUserProfile(updated);
    setIsCongratulating(true);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    if (!isSupabaseConfigured) {
      setAuthError("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.");
      setAuthLoading(false);
      // For demo purposes, we could bypass this if we want a "mock" mode, 
      // but to fix the error literally, we must stop the fetch.
      return;
    }

    try {
      if (authMode === 'signup') {
        if (!authTermsAccepted) {
          setAuthError("Please accept the terms and conditions.");
          setAuthLoading(false);
          return;
        }
        if (authPin.length !== 4) {
          setAuthError("Please create a 4-digit PIN.");
          setAuthLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: {
              pin: authPin
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          // Profile will be created by the onboarding flow later or by a trigger
        }
      } else if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
      } else if (authMode === 'pin-login') {
        // Find user by email first (this is tricky with just client side if profiles aren't public)
        // For simplicity in this demo, we'll try to sign in using the PIN as the password 
        // if they set it up that way, OR we assume they used PIN during signup as a backup password.
        // But the prompt says "if user ever forgot login details User can login with email and pin".
        
        // We'll attempt a login where password is the PIN
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPin,
        });
        if (error) {
           setAuthError("Invalid email or PIN. If you haven't set up PIN login, use your password.");
           setAuthLoading(false);
           return;
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "An error occurred during authentication.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOnboardingPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOnboardingForm(prev => ({
          ...prev,
          face_picture: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if ((editProfileForm?.pin || '').length !== 4) {
      alert("Please setup a 4-digit PIN for security.");
      return;
    }
    setUserProfile({ ...editProfileForm, is_verified: true });
    setIsProfileLocked(true);
    setShowSuccessModal(true);
  };

  const isProfileIncomplete = !userProfile || !userProfile.name?.trim() || !userProfile.phone?.trim() || !userProfile.email?.trim();

  if (!session) {
    return (
      <div className="h-screen w-full bg-[#FAF9F6] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-100 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-60" />

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl p-8 w-full max-w-md relative z-10"
        >
          <div className="flex items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-black text-white flex items-center justify-center font-black text-lg shadow-lg shadow-red-200">
              T
            </div>
            <span className="font-black text-xl text-slate-800 tracking-tight">TimeGiG <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-lg font-bold">SA</span></span>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
            <button 
              onClick={() => { setAuthMode('login'); setAuthError(""); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition ${authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Login
            </button>
            <button 
              onClick={() => { setAuthMode('signup'); setAuthError(""); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition ${authMode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Signup
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-red-500 outline-none transition-all"
                />
              </div>
            </div>

            {authMode !== 'pin-login' && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-red-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {authMode === 'signup' && (
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4 block">Create 4-Digit PIN (Recovery)</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      maxLength={4}
                      placeholder="1234"
                      value={authPin}
                      onChange={(e) => setAuthPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-red-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                    checked={authTermsAccepted}
                    onChange={(e) => setAuthTermsAccepted(e.target.checked)}
                  />
                  <span className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider group-hover:text-slate-700 transition">
                    I accept the <button type="button" className="text-red-600 hover:underline">Terms and Conditions</button> and privacy policy.
                  </span>
                </label>
              </div>
            )}

            {authMode === 'pin-login' && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4 block">Enter 4-Digit PIN</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    required
                    maxLength={4}
                    placeholder="••••"
                    value={authPin}
                    onChange={(e) => setAuthPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-red-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {authError && (
              <p className="text-[10px] font-black text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100 uppercase tracking-wider text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-red-600 active:scale-95 transition-all uppercase tracking-[0.25em] text-xs disabled:opacity-50"
            >
              {authLoading ? "Processing..." : authMode === 'signup' ? "Create Account" : "Sign In"}
            </button>

            {authMode === 'login' && (
              <button 
                type="button"
                onClick={() => { setAuthMode('pin-login'); setAuthError(""); }}
                className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 transition"
              >
                Forgot details? Login with PIN
              </button>
            )}

            {authMode === 'pin-login' && (
              <button 
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(""); }}
                className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 transition"
              >
                Back to Password Login
              </button>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  if (isCongratulating) {
    return (
      <div className="h-screen w-full bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: "100vh", opacity: [0, 1, 0] }}
              transition={{ 
                duration: Math.random() * 3 + 2, 
                repeat: Infinity, 
                delay: Math.random() * 5 
              }}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[3rem] p-10 w-full max-w-sm text-center relative z-10 shadow-2xl shadow-red-500/20"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-red-600 to-black rounded-[2rem] mx-auto flex items-center justify-center mb-8 shadow-xl rotate-12">
            <Gift className="text-white -rotate-12" size={36} />
          </div>

          <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-4">
            CONGRATULATIONS!
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 leading-relaxed">
            Your account is ready. Welcome to the TimeGiG Community.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-10">
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
              We've credited <span className="text-red-600 font-black">500c</span> to your wallet to get you started!
            </p>
          </div>

          <button
            onClick={() => {
              setIsCongratulating(false);
              setActiveTab("Chat");
            }}
            className="w-full py-5 bg-black text-white font-black rounded-2xl shadow-xl hover:bg-red-600 transition-all uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 active:scale-95"
          >
            Go to Chat <ChevronLeft className="rotate-180" size={16} />
          </button>
        </motion.div>
      </div>
    );
  }

  if (isProfileIncomplete) {
    return (
      <div className="min-h-screen w-full bg-[#FAF9F6] flex items-center justify-center p-3 sm:p-4 font-sans relative">
        {/* Ambient background blur elements */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-red-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-60" />

        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-slate-100 rounded-2xl shadow-lg p-4 sm:p-5 w-full max-w-[330px] relative z-10 pb-8"
        >
          {/* Brand header */}
          <div className="flex items-center gap-1.5 justify-center mb-2.5">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-red-600 to-black text-white flex items-center justify-center font-black text-[10px] shadow shadow-red-200">
              T
            </div>
            <span className="font-black text-xs text-slate-800 tracking-tight">TimeGiG <span className="text-[8px] text-red-600 bg-red-50 px-1 py-0.5 rounded font-bold">SA</span></span>
          </div>

          <h2 className="text-sm font-extrabold text-slate-900 tracking-tight text-center leading-tight">
            Create your profile to get started
          </h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center mt-0.5 mb-3.5">
            Please enter your details below
          </p>

          <form onSubmit={handleOnboardingSubmit} className="space-y-2.5">
            {/* Full Name */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User size={13} />
                </span>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  value={onboardingForm.name}
                  onChange={(e) => setOnboardingForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Phone size={13} />
                </span>
                <input 
                  type="tel" 
                  required
                  placeholder="e.g. +27 82 123 4567"
                  value={onboardingForm.phone}
                  onChange={(e) => setOnboardingForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail size={13} />
                </span>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. johndoe@example.com"
                  value={onboardingForm.email}
                  onChange={(e) => setOnboardingForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Date of Birth</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Calendar size={13} />
                </span>
                <input 
                  type="date" 
                  required
                  value={onboardingForm.dob}
                  onChange={(e) => setOnboardingForm(prev => ({ ...prev, dob: e.target.value }))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all text-left"
                />
              </div>
            </div>

            {/* Optional Profile Picture */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Optional: Profile Picture</label>
              
              <div className="flex flex-col gap-2 p-2 bg-slate-50/50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden shrink-0">
                    {onboardingForm.face_picture ? (
                      <img src={onboardingForm.face_picture} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-2 py-1 bg-white hover:bg-slate-50 text-[9px] font-bold uppercase tracking-wider text-slate-700 rounded-lg border border-slate-200 shadow-sm transition active:scale-[0.97]">
                      <Camera size={10} />
                      Upload Photo
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleOnboardingPhotoUpload}
                        className="hidden" 
                      />
                    </label>
                    {onboardingForm.face_picture && (
                      <button 
                        type="button"
                        onClick={() => setOnboardingForm(prev => ({ ...prev, face_picture: "" }))}
                        className="ml-2 text-[9px] font-bold text-rose-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Preset defaults */}
                <div className="border-t border-slate-100/80 pt-1.5">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Or select a default avatar:</p>
                  <div className="flex gap-1.5">
                    {[
                      { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", name: "Ava1" },
                      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", name: "Ava2" },
                      { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", name: "Ava3" },
                      { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", name: "Ava4" },
                    ].map((ava) => (
                      <button
                        key={ava.url}
                        type="button"
                        onClick={() => setOnboardingForm(prev => ({ ...prev, face_picture: ava.url }))}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition active:scale-[0.95] ${
                          onboardingForm.face_picture === ava.url ? "border-red-500 scale-105 shadow" : "border-white hover:border-slate-200"
                        }`}
                      >
                        <img src={ava.url} alt={ava.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[9px] text-slate-400 font-medium bg-slate-50 py-1.5 px-2.5 rounded-xl border border-slate-100 leading-normal">
              You can update your profile anytime in settings.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-indigo-600 text-white font-black rounded-xl shadow shadow-red-100 hover:from-red-700 hover:to-indigo-700 active:scale-[0.97] transition-all uppercase tracking-[0.15em] text-[10px] mt-1"
            >
              Continue
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F3F4F9] flex flex-col font-sans text-[#1A1C2E] overflow-hidden">
      {/* User Profile Header */}
      <div
        className="w-full bg-white px-4 py-3 flex justify-between items-center shrink-0 shadow-md border-b border-slate-100 z-10"
      >
        <div className="flex items-center gap-3">
          {userProfile?.is_verified && (
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-red-500 overflow-hidden shadow-sm bg-slate-100 flex items-center justify-center">
                {userProfile.face_picture ? (
                  <img 
                    src={userProfile.face_picture} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User size={20} className="text-slate-400" />
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-red-600 rounded-full border-2 border-white flex items-center justify-center">
                <Check size={8} className="text-white" strokeWidth={4} />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {session?.user?.email === ADMIN_EMAIL && (
            <button 
              onClick={() => setActiveTab("Admin")}
              className={`px-3 py-1.5 text-[11px] font-black rounded-xl shadow-sm active:scale-95 transition flex items-center gap-1.5 cursor-pointer border ${activeTab === 'Admin' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700'}`}
            >
              <ShieldCheck size={14} />
              <span>Admin</span>
            </button>
          )}
          
          <button 
            onClick={() => setShowPromoteModal(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-black text-white text-[11px] font-black rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition flex items-center gap-1.5 animate-pulse cursor-pointer border border-red-500"
          >
            <Megaphone size={14} className="text-white" />
            <span className="hidden sm:inline">Promote TimeGiG</span>
          </button>
          
          <button 
            onClick={() => setShowWallet(true)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 text-[11px] font-black rounded-xl shadow-sm hover:bg-slate-100 active:scale-95 transition flex items-center gap-2 cursor-pointer"
          >
            <Wallet size={14} className="text-red-600" />
            <span className="font-bold text-[12px]">{Number(balance).toLocaleString()} Coins</span>
          </button>

          {showLowBalanceAlert && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-12 left-1/2 -translate-x-1/2 z-[60] bg-rose-500 text-white px-3 py-1 rounded-xl shadow-lg flex items-center gap-1.5 border border-rose-400/50 backdrop-blur-md"
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Low Balance Alert</span>
            </motion.div>
          )}
          <motion.button 
            animate={notifications.length > 0 ? {
              rotate: [0, -15, 15, -15, 15, 0],
            } : {}}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut",
              repeatDelay: 2
            }}
            onClick={() => setShowNotifications(true)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition rounded-lg relative group active:scale-95"
          >
            <Bell size={16} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white animate-pulse" />
            )}
          </motion.button>
          <button 
            onClick={() => setShowNotificationSettings(true)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition rounded-lg relative group active:scale-95"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      <main className={`flex-1 w-full overflow-hidden relative flex flex-col ${(!activeChatContactId || activeTab !== "Chat") ? "pb-20" : ""}`}>
        {activeTab !== "Admin" && 
         activeTab !== "Chat" && 
         !(activeTab === "Market" && marketEntryMode === 'selection') && (
          <div className="w-full bg-white px-3 py-1.5 border-b border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2 z-20 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder={activeTab === "Chat" ? "Search users..." : "Search casual jobs, skills, or towns/locations..."}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-lg text-[11px] font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition text-slate-900"
              />
              {globalSearchQuery && (
                <button onClick={() => setGlobalSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={12} />
                </button>
              )}
            </div>
            {activeTab !== "Chat" && (
              <div className="relative min-w-[140px]">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 text-red-600 w-3.5 h-3.5 pointer-events-none" />
                <select
                  value={selectedProvinceFilter}
                  onChange={(e) => setSelectedProvinceFilter(e.target.value)}
                  className="w-full pl-7.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-800 appearance-none outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition cursor-pointer"
                >
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[8px]">▼</div>
              </div>
            )}
          </div>
        )}

        {activeTab === "Chat" ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            <ChatStatusBar 
              contacts={contacts} 
              activeProvince={selectedProvinceFilter} 
              isChatActive={!!activeChatContactId}
            />
            {!activeChatContactId && (
              <div className="w-full bg-white px-3 py-1.5 border-b border-slate-200 shadow-sm z-10 shrink-0">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-lg text-[11px] font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition text-slate-900"
                  />
                  {globalSearchQuery && (
                    <button onClick={() => setGlobalSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}
            {!activeChatContactId ? (
              <div className="flex-1 bg-white p-3 overflow-y-auto">
                <div className="flex flex-col gap-1 mb-3">
                  <div className="flex justify-between items-center">
                    <h2 className="font-black text-sm text-[#1A1C2E]">
                      TimeGiG Hubs & Chats
                    </h2>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest bg-red-50 text-red-600 px-2 py-0.5 rounded-full self-start">Support Unemployment</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {contacts.filter(c => {
                    const matchesSearch = !globalSearchQuery || 
                      (c?.name || '').toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
                      (c.bio && c.bio.toLowerCase().includes(globalSearchQuery.toLowerCase())) ||
                      (c.location && c.location.toLowerCase().includes(globalSearchQuery.toLowerCase()));
                    const matchesProvince = activeTab === "Chat" || selectedProvinceFilter === "All Provinces" || c.province === selectedProvinceFilter;
                    return matchesSearch && matchesProvince;
                  }).map((contact) => {
                    const contactMessages = messages.filter(
                      (m) => m.contactId === contact.id,
                    );
                    const lastMessage =
                      contactMessages[contactMessages.length - 1];
                    return (
                      <div
                        key={contact.id}
                        className="flex items-center gap-2.5 p-2 bg-[#F3F4F9] hover:bg-slate-200 rounded-lg cursor-pointer transition"
                        onClick={() => setActiveChatContactId(contact.id)}
                      >
                        <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-base shrink-0 overflow-hidden">
                          {contact.picture ? (
                            <img src={contact.picture} alt={contact?.name || ''} className="w-full h-full object-cover" />
                          ) : (
                            contact.avatar
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h3 className="font-bold text-xs text-slate-800">
                            {contact?.name || ''}
                          </h3>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {lastMessage ? lastMessage.text : "No messages yet"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                {(() => {
                  const activeContact = contacts.find(
                    (c) => c.id === activeChatContactId,
                  ) || { name: "Unknown", avatar: "U" };
                  const activeMessages = messages.filter(
                    (m) => m.contactId === activeChatContactId,
                  );
                  return (
                    <>
                      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setActiveChatContactId(null)}
                            className="text-slate-500 hover:text-slate-800 font-bold text-xl px-2"
                          >
                            ←
                          </button>
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black shrink-0 overflow-hidden">
                            {activeContact?.picture ? (
                                <img src={activeContact?.picture} alt={activeContact?.name || ''} className="w-full h-full object-cover" />
                            ) : (
                                activeContact?.avatar
                            )}
                          </div>
                          <h2 className="font-black text-lg">
                            {activeContact?.name || ''}
                          </h2>
                        </div>
                        <button
                          onClick={() =>
                            setMessages((prev) =>
                              prev.filter(
                                (m) => m.contactId !== activeChatContactId,
                              ),
                            )
                          }
                          className="text-rose-500 text-sm font-semibold px-3 py-1 bg-rose-50 rounded-lg"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="flex-1 bg-white shadow-inner p-4 overflow-y-auto space-y-4">
                        {activeMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            {message.sender === "other" && (
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-black shrink-0">
                                {activeContact.avatar}
                              </div>
                            )}
                            <div
                              onClick={() => handleBubbleClick(message.id)}
                              onMouseDown={() => startLongPress(message.id)}
                              onMouseUp={cancelLongPress}
                              onMouseLeave={cancelLongPress}
                              onTouchStart={() => startLongPress(message.id)}
                              onTouchEnd={cancelLongPress}
                              className={`relative px-3 py-1.5 rounded-2xl w-fit shadow-sm text-sm ${
                                message.sender === "user"
                                  ? "bg-indigo-500 text-white rounded-br-none"
                                  : "bg-slate-100 text-slate-800 rounded-bl-none"
                              }`}
                            >
                              {message.fileType === "image" && (
                                <img
                                  src={message.fileUrl}
                                  className="mb-2 rounded-2xl cursor-pointer"
                                  alt="attachment"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMedia({
                                      url: message.fileUrl!,
                                      type: "image",
                                    });
                                  }}
                                />
                              )}
                              {message.fileType === "video" && (
                                <video
                                  src={message.fileUrl}
                                  className="mb-2 rounded-2xl cursor-pointer"
                                  controls
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMedia({
                                      url: message.fileUrl!,
                                      type: "video",
                                    });
                                  }}
                                />
                              )}
                              <p>{message.text}</p>

                              {message.liked && (
                                <div className="absolute -bottom-2 -left-2 bg-white rounded-full p-1 shadow-md text-xs">
                                  👍
                                </div>
                              )}
                              {message.reactions &&
                                message.reactions.length > 0 && (
                                  <div className="absolute -bottom-2 -right-2 flex gap-1 bg-white rounded-full px-1.5 py-0.5 shadow-md text-[10px]">
                                    {message.reactions.map((r) => (
                                      <span
                                        key={r.emoji}
                                        className="flex items-center gap-0.5"
                                      >
                                        {r.emoji}{" "}
                                        {r.userIds.length > 1
                                          ? r.userIds.length
                                          : ""}
                                      </span>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>

                      {activeBubbleMenu !== null && (
                        <div
                          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                          onClick={() => setActiveBubbleMenu(null)}
                        >
                          <div
                            className="bg-white rounded-2xl p-4 w-64 shadow-lg flex flex-col gap-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex gap-2 justify-center flex-wrap">
                              {REACTION_EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => {
                                    toggleReaction(activeBubbleMenu, emoji);
                                    setActiveBubbleMenu(null);
                                  }}
                                  className="text-2xl hover:bg-slate-100 p-1 rounded"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                            <div className="flex flex-col gap-2 border-t pt-2">
                              <button
                                onClick={() => {
                                  const msg = messages.find(
                                    (m) => m.id === activeBubbleMenu,
                                  );
                                  if (msg) {
                                    setInputValue(msg.text || "");
                                    setEditingMessageId(msg.id);
                                    setActiveBubbleMenu(null);
                                  }
                                }}
                                className="p-2 hover:bg-slate-100 rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  deleteMessage(activeBubbleMenu);
                                  setActiveBubbleMenu(null);
                                }}
                                className="p-2 hover:bg-red-50 text-red-600 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {showEmojiPicker && (
                        <div className="grid grid-cols-8 gap-1 p-2 bg-white border-t border-slate-200 h-40 overflow-y-auto">
                          {EMOJIS.map((emoji, index) => (
                            <button
                              key={`${emoji}-${index}`}
                              onClick={() => {
                                setInputValue((prev) => prev + emoji);
                              }}
                              className="text-xl hover:bg-slate-100 p-1 rounded"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-1.5 p-1.5 border-t border-slate-200 bg-white">
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="text-slate-500 p-1 hover:text-indigo-600"
                        >
                          <Smile size={16} />
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*,video/*"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-slate-200 text-slate-600 p-1.5 rounded-md hover:bg-slate-300 transition"
                        >
                          <Paperclip size={14} />
                        </button>
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => {
                             setInputValue(e.target.value);
                             setIsTyping(e.target.value.length > 0);
                          }}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleSendMessage(undefined)
                          }
                          placeholder="Type your message..."
                          className="flex-1 text-xs py-1.5 px-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                        />
                        <button
                          onClick={() => handleSendMessage(undefined)}
                          className="bg-indigo-600 text-white p-1.5 rounded-md hover:bg-indigo-700 transition"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 w-full overflow-y-auto">
            {activeTab === "Admin" && session?.user?.email === ADMIN_EMAIL && <AdminDashboard setBalance={setBalance} setMessages={setMessages} payments={payments} setPayments={setPayments} setNotifications={setNotifications} onResetAllData={handleResetAllData} />}
            {activeTab === "Seekers" && (
              <div className="flex flex-col">
                <div className="p-3 pb-0 flex justify-end">
                  <button
                    onClick={() => setShowCreateProfile(true)}
                    className="p-1.5 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition shadow-sm border border-indigo-100"
                  >
                    <UserPlus size={14} />
                  </button>
                </div>
                <div className="w-full p-3 grid grid-cols-2 gap-2.5">
                  {seekers.filter(s => {
                    const matchesSearch = !globalSearchQuery || 
                      s?.name?.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
                      s?.bio?.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                      s?.location?.toLowerCase().includes(globalSearchQuery.toLowerCase());
                    const matchesProvince = selectedProvinceFilter === "All Provinces" || s.province === selectedProvinceFilter;
                    return matchesSearch && matchesProvince;
                  }).map((s) => (
                    <div
                      key={s.id}
                      className="p-1.5 bg-white rounded-lg shadow-sm flex flex-col gap-1.5 border border-slate-100"
                    >
                      <div
                        className="h-24 bg-slate-200 rounded overflow-hidden cursor-pointer"
                        onClick={() => {
                          if (s.portfolio.length > 0)
                            setSelectedMedia(s.portfolio[0]);
                        }}
                      >
                        {s.portfolio.length > 0 ? (
                          s.portfolio[0].type === "image" ? (
                            <img
                              src={s.portfolio[0].url}
                              className="w-full h-full object-cover"
                              alt="portfolio"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <video
                              src={s.portfolio[0].url}
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">
                            No media
                          </div>
                        )}
                      </div>
                      <div
                        className="px-0.5 cursor-pointer"
                        onClick={() => setActiveSeeker(s)}
                      >
                        <h4 className="font-bold text-xs truncate text-slate-800">{s?.name || ''}</h4>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {s.bio}
                        </p>
                        <div className="text-[11px] font-black text-indigo-600 mt-0.5">
                          R {s.rate}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!contacts.find((c) => c.id === s.id)) {
                            setContacts([
                              ...contacts,
                              {
                                id: s.id,
                                name: s?.name || '',
                                avatar: (s?.name || '').charAt(0),
                                bio: s.bio,
                                picture: s.portfolio[0]?.url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                              },
                            ]);
                          }
                          setMessages([
                            ...messages,
                            {
                              id: Date.now(),
                              text: `Hi ${s?.name || ''}, I would like to hire you!`,
                              sender: "user",
                              liked: false,
                              reactions: [],
                              contactId: s.id,
                            },
                          ]);
                          setActiveChatContactId(s.id);
                          setActiveTab("Chat");
                        }}
                        className="bg-indigo-600 text-white text-[10px] py-1 rounded-md w-full font-bold hover:bg-indigo-700 transition"
                      >
                        Hire
                      </button>
                    </div>
                  ))}
                </div>
                <div className="h-14"></div>
              </div>
            )}
            {activeTab === "GiGs" && (
              <div className="flex flex-col items-center h-full gap-2 pt-3 bg-slate-50">
                <button
                  onClick={() => setShowCreateGig(true)}
                  className="p-2.5 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition shadow-sm border border-indigo-100 group active:scale-95"
                >
                  <Briefcase size={18} className="group-hover:scale-110 transition" />
                </button>
                <div className="w-full p-3 grid grid-cols-2 gap-2.5">
                  {gigs.filter(g => {
                    const matchesSearch = !globalSearchQuery || 
                      g.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
                      g.description.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                      (g.location && g.location.toLowerCase().includes(globalSearchQuery.toLowerCase()));
                    const matchesProvince = selectedProvinceFilter === "All Provinces" || g.province === selectedProvinceFilter;
                    return matchesSearch && matchesProvince;
                  }).map((gig) => (
                    <div key={gig.id} onClick={() => setActiveGig(gig)} className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col gap-2 group cursor-pointer active:scale-95">
                      <div className="h-24 bg-slate-100 rounded-md overflow-hidden">
                        {gig.media && gig.media.length > 0 ? (
                          <img src={gig.media[0].url} className="w-full h-full object-cover" alt={gig.title} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center group-hover:bg-indigo-50 transition">
                            <Briefcase size={20} className="text-slate-300 group-hover:text-indigo-400 transition" />
                          </div>
                        )}
                      </div>
                      <div className="px-0.5">
                        <div className="flex justify-between items-start mb-0.5 gap-1">
                          <h3 className="font-bold text-xs text-slate-800 line-clamp-1 flex-1">{gig.title}</h3>
                          {gig.ownerId === 'user' && (
                            <span className="text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md tracking-widest shrink-0">Your Post</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight h-6 mb-1.5">{gig.description}</p>
                        
                        <div className="flex items-center gap-2 mb-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-0.5 text-slate-500">
                            <span className="inline-block w-1 h-1 rounded-full bg-amber-500"></span>
                            {gig.interestedCount || 0} Int.
                          </span>
                          <span className="flex items-center gap-0.5 text-slate-500">
                            <span className="inline-block w-1 h-1 rounded-full bg-emerald-500"></span>
                            {gig.appliedCount || 0} App.
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-slate-50">
                          <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">{gig.price}</span>
                          <button className="p-1 bg-slate-900 text-white rounded-full hover:bg-indigo-600 transition">
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-14"></div>
              </div>
            )}
            {activeTab === "Market" && (
              <div className="flex-1 w-full bg-slate-50 h-full overflow-y-auto flex flex-col relative">
                {marketEntryMode === 'selection' ? (
                  <div className="flex-1 flex flex-col p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-5 mt-2">
                      <div>
                        <h2 className="font-black text-xl text-slate-900 tracking-tight mb-0.5">Marketplace</h2>
                        <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">Select your destination</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab("Chat")} 
                        className="p-1.5 text-slate-500 bg-white border border-slate-100 shadow-sm rounded-lg transition active:scale-95"
                        title="Back to Chat"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => {
                          setMarketCategory('sale');
                          setMarketEntryMode('browsing');
                        }}
                        className="group relative h-28 bg-white rounded-lg border border-slate-100 p-3 flex flex-col justify-between text-left overflow-hidden shadow-sm active:scale-[0.98] transition-all hover:border-indigo-200"
                      >
                        <div className="p-2 bg-indigo-600 text-white rounded-lg w-fit group-hover:scale-110 transition-transform duration-300">
                          <ShoppingBag size={14} />
                        </div>
                        <div>
                          <h3 className="font-black text-sm text-slate-900 mb-0.5">Store (Sell)</h3>
                          <p className="text-slate-400 font-bold text-[8px] uppercase tracking-wider leading-relaxed">Items for sale</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => {
                          setMarketCategory('wanted');
                          setMarketEntryMode('browsing');
                        }}
                        className="group relative h-28 bg-white rounded-lg border border-slate-100 p-3 flex flex-col justify-between text-left overflow-hidden shadow-sm active:scale-[0.98] transition-all hover:border-amber-200"
                      >
                        <div className="p-2 bg-amber-600 text-white rounded-lg w-fit group-hover:scale-110 transition-transform duration-300">
                          <Search size={14} />
                        </div>
                        <div>
                          <h3 className="font-black text-sm text-slate-900 mb-0.5">Board (Want)</h3>
                          <p className="text-slate-400 font-bold text-[8px] uppercase tracking-wider leading-relaxed">Wanted items</p>
                        </div>
                      </button>
                    </div>

                    <div className="mt-auto pb-4 text-center">
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.25em]">Secure Peer-to-Peer Market</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="sticky top-0 z-20 bg-white p-2.5 flex flex-col gap-2.5 border-b border-slate-200 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setMarketEntryMode('selection')}
                            className="p-1.5 text-slate-500 bg-white border border-slate-100 shadow-sm rounded-lg transition"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <div>
                            <h2 className="font-black text-sm text-slate-900 tracking-tight">
                              {marketCategory === 'sale' ? 'Market: For Sale' : 'Market: Wanted Board'}
                            </h2>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              {marketCategory === 'sale' ? 'Browsing items for purchase' : 'Community requests & wanted items'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setCreateProductType(marketCategory);
                              setShowCreateProduct(true);
                            }}
                            className="p-1.5 text-white bg-indigo-600 rounded-lg transition active:scale-95 shadow-sm"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                    </div>

                    <div className="p-3 grid grid-cols-2 gap-3 pb-32">
                      {marketItems.filter(item => {
                        if (item.type !== marketCategory) return false;
                        const matchesSearch = !globalSearchQuery || 
                          item?.name?.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
                          (item.description || '').toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                          (item.location && item.location.toLowerCase().includes(globalSearchQuery.toLowerCase()));
                        const matchesProvince = selectedProvinceFilter === "All Provinces" || item.province === selectedProvinceFilter;
                        return matchesSearch && matchesProvince;
                      }).map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ 
                            y: -4,
                            transition: { duration: 0.2 }
                          }}
                          className="bg-white flex flex-col cursor-pointer group"
                          onClick={() => setActiveProduct(item)}
                        >
                          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative border border-slate-100">
                            {item.type === 'sale' && item.portfolio.length > 0 ? (
                              <img
                                src={item.portfolio[0].url}
                                className="w-full h-full object-cover"
                                alt={item?.name || ''}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-indigo-50/30">
                                {item.type === 'wanted' ? <CreditCard size={32} className="opacity-40" /> : <Camera size={32} className="opacity-40" />}
                              </div>
                            )}
                            
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                            
                            {item.type === 'sale' && (
                              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white">
                                R {item.price}
                              </div>
                            )}
                          </div>
                          
                          <div className="py-2 px-1 flex flex-col">
                            <div className="flex items-center justify-between gap-1">
                              <p className="font-bold text-[13px] text-slate-900 leading-tight line-clamp-1 flex-1">
                                R {item.price} · {item?.name || ''}
                              </p>
                              {item.ownerId === 'user' && (
                                <span className="text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded tracking-widest shrink-0">Your Post</span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                              <span className="font-bold uppercase tracking-tight">{item.location || 'Pretoria'}</span>
                              <div className="flex items-center gap-1.5 font-black text-[9px] text-slate-500 tracking-wider">
                                <span className="text-amber-500">🔥 {item.interestedCount || 0}</span>
                                <span>·</span>
                                <span className="text-emerald-500">📋 {item.appliedCount || 0}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {marketItems.filter(item => item.type === marketCategory).length === 0 && (
                      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                          <Plus className="text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-800">No {marketCategory === 'sale' ? 'items for sale' : 'wanted items'} yet</h3>
                        <p className="text-xs text-slate-500 mt-2">Be the first to post something in this category!</p>
                      </div>
                    )}
                    
                    <div className="h-24"></div>
                  </>
                )}
              </div>
            )}
            {false && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="fixed inset-0 z-[100] bg-slate-50 flex flex-col"
              >
                {isProfileLocked && userProfile?.pin ? (
                  <div className="flex-1 flex flex-col p-6 bg-slate-50 relative">
                    <button 
                      onClick={() => setActiveTab("Chat")}
                      className="absolute top-6 left-6 p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all active:scale-90"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex-1 flex flex-col items-center justify-center">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md flex flex-col items-center"
                      >
                        <div className="w-16 h-16 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-indigo-200">
                          <Lock className="w-6 h-6" />
                        </div>
                        <h2 className="font-black text-2xl text-slate-900 mb-1 tracking-tight">Locked</h2>
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-8">
                          Security PIN Required
                        </p>
                        
                        <div className="flex gap-3 mb-10">
                          {[0, 1, 2, 3].map((i) => (
                            <div 
                              key={i}
                              className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                                pinEntry.length > i 
                                  ? 'border-indigo-600 bg-white text-indigo-600 scale-110 shadow-lg shadow-indigo-100' 
                                  : pinError 
                                    ? 'border-rose-400 bg-rose-50 animate-bounce' 
                                    : 'border-slate-200 bg-white'
                              }`}
                            >
                              {pinEntry.length > i ? '•' : ''}
                            </div>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 w-full px-8">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                            <button
                              key={n}
                              onClick={() => {
                                if (pinEntry.length < 4) {
                                  const newPin = pinEntry + n;
                                  setPinEntry(newPin);
                                  if (newPin.length === 4) {
                                    if (newPin === userProfile?.pin) {
                                      setIsProfileLocked(false);
                                      setPinEntry("");
                                      setPinError(false);
                                    } else {
                                      setPinError(true);
                                      setTimeout(() => {
                                        setPinEntry("");
                                        setPinError(false);
                                      }, 800);
                                    }
                                  }
                                }
                              }}
                              className="h-14 rounded-2xl bg-white hover:bg-indigo-50 active:bg-indigo-100 font-black text-lg text-slate-800 transition-all active:scale-90 border border-slate-100 shadow-sm"
                            >
                              {n}
                            </button>
                          ))}
                          <div />
                          <button
                            onClick={() => {
                              if (pinEntry.length < 4) {
                                const newPin = pinEntry + "0";
                                setPinEntry(newPin);
                                if (newPin.length === 4) {
                                  if (newPin === userProfile?.pin) {
                                    setIsProfileLocked(false);
                                    setPinEntry("");
                                    setPinError(false);
                                  } else {
                                    setPinError(true);
                                    setTimeout(() => {
                                      setPinEntry("");
                                      setPinError(false);
                                    }, 800);
                                  }
                                }
                              }
                            }}
                            className="h-14 rounded-2xl bg-white hover:bg-indigo-50 active:bg-indigo-100 font-black text-lg text-slate-800 transition-all active:scale-90 border border-slate-100 shadow-sm"
                          >
                            0
                          </button>
                          <button
                            onClick={() => setPinEntry(pinEntry.slice(0, -1))}
                            className="h-14 rounded-2xl bg-white hover:bg-indigo-50 active:bg-indigo-100 font-bold text-slate-800 transition-all active:scale-90 border border-slate-100 shadow-sm flex items-center justify-center"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                    <div className="flex justify-between items-center px-2">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setActiveTab("Chat")}
                          className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all active:scale-90"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div>
                          <h2 className="font-black text-lg text-slate-900 leading-tight">Account</h2>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Preferences</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-600 text-white rounded-lg shadow-md shadow-indigo-100">
                          <Wallet size={10} className="opacity-80" />
                          <span className="text-[10px] font-black tracking-tight">{balance}</span>
                        </div>
                        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Balance</span>
                      </div>
                    </div>

                    <div 
                      onClick={() => setShowWallet(true)}
                      className="group relative cursor-pointer active:scale-[0.98] transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-2xl text-white shadow-lg overflow-hidden border border-white/5">
                        <div className="relative z-10 flex justify-between items-center">
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-0.5">Asset Overview</p>
                            <div className="flex items-baseline gap-1">
                              <h3 className="text-xl font-black tracking-tight">{balance}</h3>
                              <span className="text-[9px] font-bold text-indigo-400 uppercase">Tokens</span>
                            </div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/10 group-hover:rotate-6 transition-transform duration-500">
                            <Wallet size={16} className="text-indigo-300" />
                          </div>
                        </div>
                        
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl -ml-12 -mb-12"></div>
                      </div>
                    </div>

                {showSuccessModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-indigo-500 to-rose-400"></div>
                      
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner border-4 border-white">
                        ✓
                      </div>
                      
                      <h3 className="font-black text-2xl text-slate-900 mb-3 tracking-tight">
                        Congratulations!
                      </h3>
                      
                      <p className="text-slate-500 text-sm leading-relaxed mb-8 px-2">
                        Your profile has been updated and your documents have been successfully uploaded. 
                        You are now ready to explore and apply for opportunities!
                      </p>
                      
                      <button
                        onClick={() => {
                          setShowSuccessModal(false);
                          setActiveTab("Chat");
                        }}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 uppercase tracking-wider text-xs"
                      >
                        Get Started
                      </button>

                      <div className="mt-6 flex items-center gap-2 opacity-30">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                      </div>
                    </motion.div>
                  </div>
                )}

                <div className="bg-slate-100/50 p-3 rounded-xl border border-slate-200 flex flex-col gap-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="p-1 bg-indigo-100 rounded-md text-indigo-600">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-black text-xs text-slate-800 uppercase tracking-tight">Personal Info</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-1">
                      <label className="text-[8px] font-bold text-slate-400 mb-1 block uppercase tracking-wider ml-1">Name</label>
                      <input
                        type="text"
                        value={editProfileForm.name || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition"
                        placeholder="First Name"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-[8px] font-bold text-slate-400 mb-1 block uppercase tracking-wider ml-1">Middle</label>
                      <input
                        type="text"
                        value={editProfileForm.middleName || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, middleName: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition"
                        placeholder="Optional"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-[8px] font-bold text-slate-400 mb-1 block uppercase tracking-wider ml-1">Surname</label>
                      <input
                        type="text"
                        value={editProfileForm.surname || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, surname: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition"
                        placeholder="Last Name"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-[8px] font-bold text-slate-400 mb-1 block uppercase tracking-wider ml-1">Birth Date</label>
                      <input
                        type="date"
                        value={editProfileForm.dob || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, dob: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="mt-1 border-t border-slate-200 pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 bg-amber-100 rounded-md text-amber-600">
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                      <label className="text-[8px] font-black text-slate-400 block uppercase tracking-wider">
                        Profile Image
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {editProfileForm.facePicture ? (
                          <img 
                            src={editProfileForm.facePicture} 
                            className="w-full h-full object-cover" 
                            alt="Face" 
                          />
                        ) : (
                          <Users className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.readAsDataURL(file);
                              reader.onload = () => {
                                setEditProfileForm({
                                  ...editProfileForm,
                                  facePicture: reader.result as string,
                                  facePictureName: file.name,
                                  facePictureSize: file.size,
                                });
                              };
                            }
                          }}
                          className="hidden"
                          id="face-upload"
                        />
                        <label 
                          htmlFor="face-upload"
                          className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer hover:bg-indigo-700 transition shadow-sm text-center"
                        >
                          Change Photo
                        </label>
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Clear portrait only</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pb-14">
                  {/* Identification Module */}
                  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600 shadow-sm border border-rose-100/50">
                          <CreditCard className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="font-black text-xs text-slate-800 uppercase tracking-tight">Identification</h3>
                      </div>
                      <div className="h-px flex-1 bg-slate-50 mx-3"></div>
                    </div>

                    <div className="space-y-3">
                      <div className="group relative">
                        <label className="text-[8px] font-black text-slate-400 mb-1.5 block uppercase tracking-[0.15em] ml-1">ID Document</label>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          id="id-upload"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.readAsDataURL(file);
                              reader.onload = () => {
                                setEditProfileForm({
                                  ...editProfileForm,
                                  idDocumentFace: reader.result as string,
                                  idDocumentFaceName: file.name,
                                  idDocumentFaceSize: file.size,
                                });
                              };
                            }
                          }}
                        />
                        <label 
                          htmlFor="id-upload"
                          className="flex flex-col items-center justify-center gap-1.5 p-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50/30 transition-all cursor-pointer group/upload"
                        >
                          <Camera className="w-5 h-5 group-hover/upload:scale-110 transition-transform" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Update ID Card</span>
                        </label>
                        
                        {editProfileForm.idDocumentFace && (
                          <div className="mt-2.5 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group/id">
                            <img 
                              src={editProfileForm.idDocumentFace} 
                              className="w-full h-auto max-h-32 object-cover bg-slate-50" 
                              alt="ID Preview" 
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/id:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[1px]">
                              <div className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                                Verified
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Security & Documents Module */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 shadow-sm border border-indigo-100/50">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="font-black text-xs text-slate-800 uppercase tracking-tight">Security</h3>
                      </div>

                      <div className="space-y-4">
                        {/* PIN SECTION */}
                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                          <label className="text-[8px] font-black text-slate-400 mb-1.5 block uppercase tracking-[0.1em] ml-1">Account PIN</label>
                          <div className="relative">
                            <input
                              type="password"
                              maxLength={4}
                              value={editProfileForm.pin || ''}
                              onChange={(e) => setEditProfileForm({ ...editProfileForm, pin: e.target.value.replace(/\D/g, "") })}
                              className="w-full py-2 bg-white border border-slate-200 rounded-lg text-lg font-black tracking-[0.6em] text-center text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-sm"
                              placeholder="••••"
                            />
                          </div>
                        </div>

                        {/* DOCUMENT LIST */}
                        <div className="space-y-2">
                          <div className="group/doc relative">
                            <input
                              type="file"
                              id="cv-upload"
                              className="hidden"
                              onChange={(e) => e.target.files && e.target.files[0] && setEditProfileForm({...editProfileForm, cvDocument: e.target.files[0].name})}
                            />
                            <label 
                              htmlFor="cv-upload"
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${editProfileForm.cvDocument ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-slate-100 hover:border-indigo-100'}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-md ${editProfileForm.cvDocument ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                  <FileText size={12} />
                                </div>
                                <div>
                                  <p className="text-[9px] font-black text-slate-800 tracking-tight">CV Document</p>
                                  <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tight truncate max-w-[120px]">{editProfileForm.cvDocument || 'Upload PDF'}</p>
                                </div>
                              </div>
                              {editProfileForm.cvDocument && <div className="w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-black">✓</div>}
                            </label>
                          </div>

                          <div className="group/doc relative">
                            <input
                              type="file"
                              id="cert-upload"
                              className="hidden"
                              onChange={(e) => e.target.files && e.target.files[0] && setEditProfileForm({...editProfileForm, certificate_document: e.target.files[0].name})}
                            />
                            <label 
                              htmlFor="cert-upload"
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${editProfileForm.certificate_document ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-slate-100 hover:border-emerald-100'}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-md ${editProfileForm.certificate_document ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                  <Award size={12} />
                                </div>
                                <div>
                                  <p className="text-[9px] font-black text-slate-800 tracking-tight">Qualifications</p>
                                  <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tight truncate max-w-[120px]">{editProfileForm.certificate_document || 'Certificates'}</p>
                                </div>
                              </div>
                              {editProfileForm.certificate_document && <div className="w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-black">✓</div>}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 px-1">
                    <button
                      onClick={handleSaveProfile}
                      className="group relative w-full active:scale-[0.98] transition-all"
                    >
                      <div className="absolute inset-0 bg-indigo-600 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative w-full py-3.5 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5">
                        <Save size={14} />
                        <span className="text-[10px] uppercase tracking-[0.15em]">Sync Profile</span>
                      </div>
                    </button>
                    <p className="text-[7px] font-bold text-slate-400 text-center uppercase tracking-widest opacity-60">
                      Cloud Sync Active • Security Patched
                    </p>
                  </div>
                </div>
              </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </main>

      {activeSeeker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setActiveSeeker(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold">{activeSeeker?.name || ''}</h3>
            <p className="text-slate-600">{activeSeeker?.bio || ''}</p>
            <p className="text-sm">
              <strong>Location:</strong> {activeSeeker?.location || ''}
            </p>
            <p className="text-sm">
              <strong>Rate:</strong> R {activeSeeker?.rate || ''}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {activeSeeker.portfolio.map((item, i) =>
                item.type === "image" ? (
                  <img
                    key={i}
                    src={item.url}
                    className="rounded-lg w-full h-24 object-cover cursor-pointer"
                    alt="portfolio"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    onClick={() => setSelectedMedia(item)}
                  />
                ) : (
                  <video
                    key={i}
                    src={item.url}
                    className="rounded-lg w-full h-24 object-cover cursor-pointer"
                    onClick={() => setSelectedMedia(item)}
                  />
                ),
              )}
            </div>

            <button
              onClick={() => setActiveSeeker(null)}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeGig && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setActiveGig(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-6 w-full max-w-sm shadow-2xl flex flex-col gap-5 max-h-[85vh] overflow-y-auto overflow-x-hidden border border-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveGig(null)}
              className="absolute top-5 right-5 p-2 bg-slate-50 text-slate-400 hover:text-slate-800 rounded-full transition-all hover:bg-slate-100"
            >
              <X size={16} />
            </button>
            
            <div className="flex flex-col gap-1 pr-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{activeGig.title}</h3>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{activeGig.category}</p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              {activeGig.ownerAvatar ? (
                <img src={activeGig.ownerAvatar} alt={activeGig.ownerName || "Owner"} className="w-10 h-10 rounded-full bg-white border-2 border-indigo-100" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {(activeGig.ownerName || "Owner").charAt(0)}
                </div>
              )}
              <div>
                <p className="text-xs font-black text-slate-800">{activeGig.ownerName || "Gig Owner"}</p>
                <p className="text-[10px] text-slate-500 font-medium">Gig Poster</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">{activeGig.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[11px] font-bold border border-slate-100">
                <MapPin size={12} className="text-indigo-500" />
                {activeGig.location}, {activeGig.province}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-[11px] font-black uppercase tracking-wider border border-green-100">
                <Briefcase size={12} />
                {activeGig.price}
              </div>
            </div>

            {activeGig.media && activeGig.media.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attached Media</p>
                <div className="grid grid-cols-2 gap-2">
                  {activeGig.media.map((item, i) =>
                    item.type === "image" ? (
                      <img
                        key={i}
                        src={item.url}
                        alt="Gig attached media"
                        className="rounded-xl w-full h-28 object-cover cursor-pointer hover:opacity-90 transition shadow-sm border border-slate-100"
                        onClick={() => setSelectedMedia(item)}
                      />
                    ) : (
                      <div key={i} className="relative w-full h-28 rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-slate-100" onClick={() => setSelectedMedia(item)}>
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
                            <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {activeGig.ownerId === 'user' ? (
              <div className="flex flex-col gap-3 mt-2">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-3xl flex flex-col gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-700">GiG Live Activity</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-white p-3 rounded-2xl border border-indigo-100/60 shadow-sm">
                      <p className="text-xl font-black text-amber-500">{activeGig.interestedCount || 0}</p>
                      <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Interested</p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-indigo-100/60 shadow-sm">
                      <p className="text-xl font-black text-emerald-500">{activeGig.appliedCount || 0}</p>
                      <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Applied</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-indigo-600/90 font-medium leading-relaxed text-center">
                    This is your own GiG opportunity. You can monitor performance stats above.
                  </p>
                </div>
                <button
                  disabled
                  className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-[0.2em] text-xs cursor-not-allowed border border-slate-200/50"
                >
                  Your Own Opportunity
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  const ownerId = activeGig.ownerId || "default_owner_id";
                  const ownerName = activeGig.ownerName || "Gig Owner";
                  if (!contacts.find(c => c.id === ownerId)) {
                    setContacts([
                      ...contacts,
                      {
                        id: ownerId,
                        name: ownerName,
                        avatar: ownerName.charAt(0),
                        bio: "Gig Owner",
                        picture: activeGig.media?.[0]?.url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                      }
                    ]);
                  }
                  
                  // Increment applied and interested count for other user's gig
                  setGigs(prevGigs => prevGigs.map(g => {
                    if (g.id === activeGig.id) {
                      return {
                        ...g,
                        interestedCount: (g.interestedCount || 0) + 1,
                        appliedCount: (g.appliedCount || 0) + 1
                      };
                    }
                    return g;
                  }));

                  setMessages([
                    ...messages,
                    {
                      id: Date.now(),
                      text: `I can do your gig: ${activeGig.title}`,
                      sender: "user",
                      liked: false,
                      reactions: [],
                      contactId: ownerId,
                    }
                  ]);
                  setActiveChatContactId(ownerId);
                  setActiveTab("Chat");
                  setActiveGig(null);
                }}
                className="w-full mt-2 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-lg shadow-indigo-200 hover:bg-indigo-700"
              >
                I Can Do
              </button>
            )}
          </motion.div>
        </div>
      )}

      {activeProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold">{activeProduct?.name || ''}</h3>
            <p className="text-slate-600">{activeProduct.description}</p>
            <p className="text-sm">
              <strong>Price:</strong> R {activeProduct.price}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {activeProduct.portfolio.map((item, i) =>
                item.type === "image" ? (
                  <img
                    key={i}
                    src={item.url}
                    className="rounded-lg w-full h-24 object-cover cursor-pointer"
                    alt="product"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    onClick={() => setSelectedMedia(item)}
                  />
                ) : (
                  <video
                    key={i}
                    src={item.url}
                    className="rounded-lg w-full h-24 object-cover cursor-pointer"
                    onClick={() => setSelectedMedia(item)}
                  />
                ),
              )}
            </div>

            {activeProduct.ownerId === 'user' ? (
              <div className="flex flex-col gap-3 mt-4 w-full">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col gap-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Market Performance Stats</p>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-sm">
                      <p className="text-lg font-black text-amber-500">{activeProduct.interestedCount || 0}</p>
                      <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Interested</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-sm">
                      <p className="text-lg font-black text-emerald-500">{activeProduct.appliedCount || 0}</p>
                      <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Inquiries</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-indigo-600/80 font-medium text-center">
                    This is your own listing. You can't express interest in it.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled
                    className="py-2.5 px-4 bg-slate-100 text-slate-400 rounded-full font-bold flex-1 cursor-not-allowed border border-slate-200/50 text-xs uppercase"
                  >
                    Your Listing
                  </button>
                  <button
                    onClick={() => setActiveProduct(null)}
                    className="py-2.5 px-4 bg-slate-100 text-slate-600 rounded-full font-bold flex-1 text-xs uppercase hover:bg-slate-200 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => {
                    if (activeProduct.ownerId) {
                      const ownerId = activeProduct.ownerId;
                      const ownerName = activeProduct.ownerName || "Seller";
                      if (!contacts.find(c => c.id === ownerId)) {
                        setContacts(prev => [
                          ...prev,
                          {
                            id: ownerId,
                            name: ownerName,
                            avatar: ownerName.charAt(0),
                            bio: "Market Member",
                            picture: activeProduct.portfolio?.[0]?.url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                          }
                        ]);
                      }

                      // Increment counters for other user's market listing
                      setMarketItems(prevItems => prevItems.map(item => {
                        if (item.id === activeProduct.id) {
                          return {
                            ...item,
                            interestedCount: (item.interestedCount || 0) + 1,
                            appliedCount: (item.appliedCount || 0) + 1
                          };
                        }
                        return item;
                      }));

                      setMessages([
                        ...messages,
                        {
                          id: Date.now(),
                          text: activeProduct.type === 'wanted' 
                            ? `I know someone who can help with: ${activeProduct?.name || ''}`
                            : `I am interested in: ${activeProduct?.name || ''}`,
                          sender: "user",
                          liked: false,
                          reactions: [],
                          contactId: activeProduct.ownerId,
                        }
                      ]);
                      setActiveChatContactId(activeProduct.ownerId);
                      setActiveTab("Chat");
                      setActiveProduct(null);
                    }
                  }}
                  className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold flex-1 transition active:scale-95 text-xs uppercase tracking-widest"
                >
                  {activeProduct.type === 'wanted' ? 'I know' : 'Interested'}
                </button>
                <button
                  onClick={() => setActiveProduct(null)}
                  className="mt-4 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-semibold flex-1 transition text-xs uppercase"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedMedia && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          {selectedMedia.type === "image" ? (
            <img
              src={selectedMedia.url}
              className="max-w-full max-h-full rounded-lg"
              alt="full screen"
              onError={() => setSelectedMedia(null)}
            />
          ) : (
            <video
              src={selectedMedia.url}
              className="max-w-full max-h-full rounded-lg"
              controls
              autoPlay
            />
          )}
        </div>
      )}

      {showCreateProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCreateProfile(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold">Create Seeker Profile</h3>
            <input
              type="text"
              placeholder="Name"
              className="p-2 border rounded"
              id="seeker-name"
            />
            <textarea
              placeholder="Describe your service"
              className="p-2 border rounded"
              id="seeker-bio"
            ></textarea>
            <input
              type="text"
              placeholder="Location"
              className="p-2 border rounded"
              id="seeker-location"
            />
            <input
              type="text"
              placeholder="Rate (Coins)"
              className="p-2 border rounded"
              id="seeker-rate"
            />

            <p className="text-sm text-slate-500">
              Upload images/videos (simulated)
            </p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              id="seeker-files"
            />

            <button
              onClick={() => {
                const name = (
                  document.getElementById("seeker-name") as HTMLInputElement
                ).value;
                const bio = (
                  document.getElementById("seeker-bio") as HTMLTextAreaElement
                ).value;
                const location = (
                  document.getElementById("seeker-location") as HTMLInputElement
                ).value;
                const rate = (
                  document.getElementById("seeker-rate") as HTMLInputElement
                ).value;

                if (!name) return;

                // Simulated portfolio item from the first file if any
                const fileInput = document.getElementById(
                  "seeker-files",
                ) as HTMLInputElement;
                const portfolio: { type: "image" | "video"; url: string }[] =
                  [];
                if (fileInput.files && fileInput.files[0]) {
                  portfolio.push({
                    type: fileInput.files[0].type.startsWith("image/")
                      ? "image"
                      : "video",
                    url: URL.createObjectURL(fileInput.files[0]),
                  });
                }

                setSeekers([
                  ...seekers,
                  {
                    id: Date.now().toString(),
                    name,
                    bio,
                    location,
                    rate,
                    portfolio,
                  },
                ]);
                alert("Congratulations! Your profile is now live.");
                setShowCreateProfile(false);
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {showCreateProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCreateProduct(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {createProductType === 'sale' ? 'Post Item for Sale' : 'Post Wanted Request'}
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {createProductType === 'sale' ? 'Product Name' : 'Item Name'}
                </label>
                <input
                  type="text"
                  placeholder={createProductType === 'sale' ? "E.G. IPHONE 13 PRO" : "E.G. LOOKING FOR LAPTOP"}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                  id="product-name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Description
                </label>
                <textarea
                  placeholder={createProductType === 'sale' ? "DESCRIBE THE CONDITION AND SPECS..." : "SPECIFY YOUR REQUIREMENTS..."}
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition resize-none"
                  id="product-description"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {createProductType === 'sale' ? 'Price (Coins)' : 'Budget (Coins)'}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                  id="product-price"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Visuals
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    id="product-files"
                    className="hidden"
                  />
                  <label 
                    htmlFor="product-files"
                    className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-100 rounded-3xl text-slate-300 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                  >
                    <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Add Photos/Videos</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                  onClick={async () => {
                    const name = (document.getElementById("product-name") as HTMLInputElement).value;
                    const description = (document.getElementById("product-description") as HTMLTextAreaElement).value;
                    const price = (document.getElementById("product-price") as HTMLInputElement).value;

                    if (!name || !price || !session) return;

                    const portfolio: { type: "image" | "video"; url: string }[] = [];
                    const fileInput = document.getElementById("product-files") as HTMLInputElement;
                    if (fileInput.files && fileInput.files[0]) {
                      portfolio.push({
                        type: fileInput.files[0].type.startsWith("image/") ? "image" : "video",
                        url: URL.createObjectURL(fileInput.files[0]),
                      });
                    }

                    const newItem = {
                      name,
                      description,
                      price: Number(price),
                      portfolio,
                      type: createProductType,
                      ownerId: session.user.id,
                      ownerName: userProfile?.name || 'User',
                      interestedCount: 0,
                      appliedCount: 0,
                    };

                    if (isSupabaseConfigured) {
                      const { data, error } = await supabase.from('market_items').insert([mapMarketItemToDb(newItem)]).select();
                      if (!error && data) {
                        setMarketItems([mapMarketItemFromDb(data[0]), ...marketItems]);
                      }
                    } else {
                      setMarketItems([{ id: Date.now().toString(), ...newItem }, ...marketItems]);
                    }

                    alert(`Success! Your ${createProductType === 'sale' ? 'listing' : 'request'} is now live.`);
                    setShowCreateProduct(false);
                  }}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition active:scale-95 text-xs uppercase tracking-widest"
              >
                {createProductType === 'sale' ? 'Confirm & Post for Sale' : 'Post Wanted Request'}
              </button>
              <button 
                onClick={() => setShowCreateProduct(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition text-[10px] uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {(activeTab !== "Chat" || !activeChatContactId) && !showCreateProduct && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <footer className="bg-white border-t border-slate-200 shadow-[0_-8px_24px_rgba(0,0,0,0.05)] flex justify-around items-center py-2.5 px-3 pb-6 relative overflow-hidden">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    if (item.name === "Market") {
                      setMarketEntryMode('selection');
                    }
                  }}
                  className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-150 ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100 scale-105" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className={`w-[20px] h-[20px] ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className={`text-[11px] font-bold mt-1 tracking-tight ${isActive ? 'text-white font-black' : 'text-slate-600'}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </footer>
        </div>
      )}
      {showWallet && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowWallet(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pb-0 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Your Wallet</h3>
              <button 
                onClick={() => setShowWallet(false)}
                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition"
              >
                <Plus className="rotate-45" size={20} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
              {walletView === "main" && (
                <>
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <h4 className="text-sm font-bold opacity-70 uppercase tracking-widest">Available Balance</h4>
                    <div className="text-5xl font-black mt-2 flex items-baseline gap-1">
                      {balance} <span className="text-lg opacity-60 font-medium">coins</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setWalletView("topup")}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 transition group"
                    >
                      <Plus size={20} className="text-indigo-600 group-hover:scale-110 transition" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Top-up</span>
                    </button>
                    <button
                      onClick={() => setWalletView("transfer")}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 transition group"
                    >
                      <Send size={20} className="text-indigo-600 group-hover:scale-110 transition" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Transfer</span>
                    </button>
                    <button
                      onClick={() => setWalletView("receive")}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 transition group"
                    >
                      <Plus size={20} className="text-indigo-600 group-hover:scale-110 transition rotate-45" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Receive</span>
                    </button>
                  </div>
                  
                  <div className="bg-white">
                    <h4 className="font-black text-slate-900 mb-4 flex justify-between items-center">
                      <span>History</span>
                      <button className="text-[10px] text-indigo-600 uppercase tracking-widest">See all</button>
                    </h4>
                    <div className="flex flex-col gap-4">
                      {transactions.length > 0 ? transactions.map((t) => (
                        <div key={t.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'received' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {t.type === 'received' ? <Plus size={18} /> : <Send size={18} />}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-800">{t.recipient}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.date}</p>
                            </div>
                          </div>
                          <p className={`font-black text-sm ${t.type === "received" ? "text-emerald-600" : "text-rose-600"}`}>
                            {t.type === "received" ? "+" : "-"}{t.amount}
                          </p>
                        </div>
                      )) : (
                        <div className="py-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No transactions yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {walletView === "topup" && (
                <div className="flex flex-col gap-6">
                  <button onClick={() => { setWalletView("main"); setTopupStep("select"); }} className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                    <Plus className="rotate-45" size={14} /> Back
                  </button>
                  {topupStep === "select" ? (
                    <>
                      <h4 className="font-black text-slate-900">Select Amount</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {TOPUP_OPTIONS.map((opt) => (
                          <button
                            key={opt.coins}
                            onClick={() => { setSelectedTopupOption(opt); setTopupStep("payment"); }}
                            className="p-6 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-indigo-600 transition text-left group"
                          >
                            <div className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition">{opt.coins}</div>
                            <div className="text-xs font-bold text-slate-400 mt-1">{opt.price}</div>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : topupStep === "payment" ? (
                    <div className="flex flex-col gap-4">
                      <h4 className="font-black text-slate-900">Bank Transfer</h4>
                      <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex flex-col gap-3">
                        <div className="flex justify-between">
                          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Bank</span>
                          <span className="text-sm font-bold text-indigo-900">Capitec</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Account</span>
                          <span className="text-sm font-bold text-indigo-900">Matthews</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Number</span>
                          <span className="text-sm font-bold text-indigo-900">1334067366</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Reference</span>
                          <span className="text-sm font-black text-indigo-600">{selectedTopupOption?.coins}</span>
                        </div>
                      </div>
                      <button onClick={() => setTopupStep("proof")} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-indigo-100">I have paid, proceed to upload</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <h4 className="font-black text-slate-900">Upload Proof of Payment</h4>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-300 text-center">
                        <input type="file" accept="image/*" onChange={async (e) => {
                            if (e.target.files && e.target.files[0] && session) {
                                const file = e.target.files[0];
                                const documentUrl = URL.createObjectURL(file);
                                const newPayment = {
                                    userId: session.user.id,
                                    userName: `${userProfile?.name || ''} ${userProfile?.surname || ''}`,
                                    amount: parseInt(selectedTopupOption?.coins || '0'),
                                    documentUrl,
                                    status: 'pending',
                                    date: new Date().toISOString().split('T')[0]
                                };
                                
                                if (isSupabaseConfigured) {
                                    const { data, error } = await supabase.from('proofs_of_payment').insert([mapPaymentToDb(newPayment)]).select();
                                    if (!error && data) {
                                        setPayments(prev => [mapPaymentFromDb(data[0]), ...prev]);
                                    }
                                } else {
                                    setPayments(prev => [{ id: Date.now().toString(), ...newPayment }, ...prev]);
                                }
                            }
                        }} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                      </div>
                      <button onClick={() => { 
                          setMessages(prev => [...prev, {
                              id: Date.now(),
                              text: "Your proof of payment has been uploaded and is under review.",
                              sender: 'other'
                          }]);
                          alert("Success! Your POP is being reviewed."); 
                          setWalletView("main"); 
                          setTopupStep("select"); 
                      }} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-indigo-100">Submit</button>
                    </div>
                  )}
                </div>
              )}

              {walletView === "transfer" && (
                <div className="flex flex-col gap-4">
                  <button onClick={() => setWalletView("main")} className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                    <Plus className="rotate-45" size={14} /> Back
                  </button>
                  <h4 className="font-black text-slate-900">Send Coins</h4>
                  <input type="text" placeholder="RECIPIENT NAME" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-sm uppercase tracking-wider" />
                  <input type="text" placeholder="TRANSFER CODE" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-sm uppercase tracking-wider" />
                  <input type="number" placeholder="AMOUNT" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-black text-2xl" />
                  <button onClick={() => { alert("Coins transferred successfully!"); setWalletView("main"); }} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs mt-4 shadow-lg shadow-indigo-100">Send Now</button>
                </div>
              )}

              {walletView === "receive" && (
                <div className="flex flex-col gap-6 items-center text-center">
                  <button onClick={() => setWalletView("main")} className="self-start text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                    <Plus className="rotate-45" size={14} /> Back
                  </button>
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                    <Plus className="text-indigo-600 rotate-45" size={40} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">Your Receive Code</h4>
                    <p className="text-xs text-slate-500 mt-1">Share this code with the sender</p>
                  </div>
                  <div className="w-full p-6 bg-slate-900 rounded-[2rem] text-white font-mono font-black text-xl tracking-[0.2em] shadow-xl border-4 border-slate-800">
                    COIN-RX-1234
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText("COIN-RX-1234"); alert("Code copied!"); }}
                    className="px-8 py-3 bg-indigo-100 text-indigo-600 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-indigo-200 transition"
                  >
                    Copy Code
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      {showNotifications && (() => {
        const allTrayItems = [
          ...notifications.map(n => ({
            id: `notif-${n.id}`,
            title: n.title,
            message: n.message,
            time: n.time,
            type: n.type || 'system',
            contactId: n.contactId
          })),
          ...messages.filter(m => m.sender === 'other' && !clearedMessageIds.includes(m.id)).map(m => {
            const contact = contacts.find(c => c.id === m.contactId) || { name: 'User' };
            return {
              id: `msg-${m.id}`,
              title: `Chat from ${contact?.name || ''}`,
              message: m.text || 'Shared a document',
              time: 'New Message',
              type: 'message',
              contactId: m.contactId
            };
          })
        ];

        return (
          <div 
            className="fixed inset-0 z-[130] bg-black/40 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowNotifications(false)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white/95 backdrop-blur-2xl w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50 max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Updates & Messages</p>
                  </div>
                  <div className="flex gap-2">
                    {allTrayItems.length > 0 && (
                      <button 
                        onClick={() => {
                          setNotifications([]);
                          const otherMsgIds = messages.filter(m => m.sender === 'other').map(m => m.id);
                          setClearedMessageIds(prev => {
                            const combined = [...prev, ...otherMsgIds];
                            return Array.from(new Set(combined));
                          });
                        }}
                        className="text-[9px] font-black uppercase text-rose-500 bg-rose-50 px-3 py-1.5 rounded-xl hover:bg-rose-100 transition"
                      >
                        Clear All
                      </button>
                    )}
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="p-3 bg-slate-100 rounded-2xl text-slate-500 hover:text-slate-800 transition active:scale-90"
                    >
                      <Plus className="rotate-45" size={24} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col gap-2 min-h-0 pr-1 custom-scrollbar">
                  {allTrayItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                      <Bell size={48} strokeWidth={1} className="mb-4 opacity-50" />
                      <p className="font-black text-xs uppercase tracking-widest">No notifications yet</p>
                    </div>
                  ) : (
                    allTrayItems.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`group p-3 bg-slate-50 hover:bg-indigo-50/40 rounded-xl border border-slate-100 relative hover:shadow-sm transition duration-150 cursor-pointer`}
                        onClick={() => {
                          if (notif.contactId) {
                            setActiveChatContactId(notif.contactId);
                            setActiveTab("Chat");
                            setShowNotifications(false);
                          }
                        }}
                      >
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (notif.id.startsWith('notif-')) {
                              const realId = notif.id.replace('notif-', '');
                              setNotifications(prev => prev.filter(n => n.id !== realId));
                            } else if (notif.id.startsWith('msg-')) {
                              const realId = parseInt(notif.id.replace('msg-', ''), 10);
                              setClearedMessageIds(prev => {
                                const combined = [...prev, realId];
                                return Array.from(new Set(combined));
                              });
                            }
                          }}
                          className="absolute top-2 right-2 p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={12} />
                        </button>
                        <div className="flex items-start gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            notif.type === 'success' ? 'bg-emerald-50 text-emerald-500' : notif.type === 'message' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {notif.type === 'success' ? <Check size={12} /> : notif.type === 'message' ? <MessageCircle size={12} /> : <Bell size={12} />}
                          </div>
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="font-bold text-[11px] text-slate-900 truncate">{notif.title}</p>
                            <p className="text-[10px] text-slate-500 leading-normal mt-0.5 break-words">{notif.message}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.25em] text-xs shadow-xl shadow-slate-200 hover:bg-indigo-600 transition shrink-0"
                >
                  Close Tray
                </button>
              </div>
            </motion.div>
          </div>
        );
      })()}
      {showNotificationSettings && (
        <div 
          className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowNotificationSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-2xl w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">App Settings</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure profile & preferences</p>
                </div>
                <button 
                  onClick={() => setShowNotificationSettings(false)}
                  className="p-2.5 bg-slate-100 rounded-2xl text-slate-500 hover:text-slate-800 transition active:scale-90"
                >
                  <Plus className="rotate-45" size={20} />
                </button>
              </div>

              {/* Settings Tab Selectors */}
              <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => setSettingsTab('profile')}
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition flex flex-col items-center gap-1 ${
                    settingsTab === 'profile' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User size={14} />
                  Profile
                </button>
                <button
                  onClick={() => setSettingsTab('notifications')}
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition flex flex-col items-center gap-1 ${
                    settingsTab === 'notifications' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Bell size={14} />
                  Alerts
                </button>
                <button
                  onClick={() => setSettingsTab('account')}
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition flex flex-col items-center gap-1 ${
                    settingsTab === 'account' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck size={14} />
                  Account
                </button>
              </div>

              {settingsTab === 'profile' && (
                <div className="flex flex-col gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <User size={14} />
                      </span>
                      <input 
                        type="text" 
                        value={editProfileForm.name || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Phone Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <Phone size={14} />
                      </span>
                      <input 
                        type="tel" 
                        value={editProfileForm.phone || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        placeholder="e.g. +27 82 123 4567"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <Mail size={14} />
                      </span>
                      <input 
                        type="email" 
                        value={editProfileForm.email || ''}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        placeholder="e.g. johndoe@example.com"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Date of Birth</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <Calendar size={14} />
                      </span>
                      <input 
                        type="date" 
                        value={editProfileForm.dob || '1995-05-12'}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, dob: e.target.value })}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-left"
                      />
                    </div>
                  </div>

                  {/* Profile Picture */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Profile Picture</label>
                    <div className="flex flex-col gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden shrink-0">
                          {editProfileForm.face_picture ? (
                            <img src={editProfileForm.face_picture} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <User size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-700 rounded-lg border border-slate-200 shadow-sm transition active:scale-95">
                            <Camera size={12} />
                            Upload Photo
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setEditProfileForm({ ...editProfileForm, face_picture: reader.result as string });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden" 
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        if (!editProfileForm.name?.trim() || !editProfileForm.phone?.trim() || !editProfileForm.email?.trim()) {
                          alert("Please fill in all details (Full Name, Phone Number, and Email Address).");
                          return;
                        }
                        const updated = {
                          ...userProfile,
                          name: editProfileForm.name,
                          phone: editProfileForm.phone,
                          email: editProfileForm.email,
                          face_picture: editProfileForm.face_picture || ""
                        };
                        setUserProfile(updated);
                        setShowNotificationSettings(false);
                      }}
                      className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-100 transition"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              )}

              {settingsTab === 'notifications' && (
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'messages', label: 'Direct Messages', icon: MessageCircle, desc: 'Chat alerts from contacts' },
                    { id: 'gigs', label: 'GiG Opportunities', icon: Briefcase, desc: 'New tasks in your area' },
                    { id: 'market', label: 'Market Updates', icon: ShoppingBag, desc: 'New items & price alerts' },
                    { id: 'wallet', label: 'Wallet Activity', icon: Wallet, desc: 'Transaction notifications' },
                    { id: 'sound', label: 'Sound', icon: Volume2, desc: 'Play sound for notifications' }
                  ].map((pref) => (
                    <div 
                      key={pref.id}
                      className="p-4 bg-white border border-slate-100 rounded-[1.25rem] flex items-center justify-between shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                          <pref.icon size={18} />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm tracking-tight">{pref.label}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight mt-0.5">{pref.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotificationSettings(prev => ({
                          ...prev,
                          [pref.id]: !prev[pref.id as keyof typeof prev]
                        }))}
                        className={`w-12 h-7 rounded-full relative transition-colors duration-300 flex items-center px-1 shrink-0 ${
                          notificationSettings[pref.id as keyof typeof notificationSettings] ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                      >
                        <motion.div
                          animate={{ x: notificationSettings[pref.id as keyof typeof notificationSettings] ? 20 : 0 }}
                          className="w-5 h-5 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                  ))}
                  <div className="mt-6 flex flex-col gap-2.5">
                    <button
                      onClick={() => setShowNotificationSettings(false)}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 hover:bg-indigo-600 transition"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {settingsTab === 'account' && (
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-[1.5rem] flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-rose-600">
                      <ShieldCheck size={20} />
                      <h4 className="font-black text-sm uppercase tracking-wider">Account Security</h4>
                    </div>
                    <p className="text-xs text-rose-600/80 font-medium leading-relaxed">
                      Manage your account status and visibility. Disabling your account will hide your profile from the public.
                    </p>
                    
                    <button
                      onClick={() => {
                        setUserProfile(prev => ({ ...prev, is_disabled: !prev.is_disabled }));
                        setShowNotificationSettings(false);
                      }}
                      className={`w-full py-3.5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition flex items-center justify-center gap-2 ${
                        userProfile?.is_disabled 
                          ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                          : "bg-rose-500 text-white hover:bg-rose-600"
                      }`}
                    >
                      <PowerOff size={16} /> {userProfile?.is_disabled ? "Enable Account" : "Disable Account"}
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Lock size={20} />
                      <h4 className="font-black text-sm uppercase tracking-wider">Authentication</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      You are currently signed in as <span className="font-bold text-slate-900">{session?.user?.email || 'User'}</span>.
                    </p>
                    <button
                      onClick={() => supabase.auth.signOut()}
                      className="w-full py-3.5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-100 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      {showCreateGig && (
        <div 
          className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowCreateGig(false)}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Post a GiG</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Hire someone for a task</p>
                </div>
                <button 
                  onClick={() => setShowCreateGig(false)}
                  className="p-3 bg-slate-100 rounded-2xl text-slate-500 hover:text-slate-800 transition active:scale-90"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">GiG Media</label>
                  <div className="grid grid-cols-1 gap-2">
                    {gigImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 group">
                        <img src={img} className="w-full h-full object-cover" alt={`gig-${idx}`} />
                        <button 
                          onClick={() => setGigImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {gigImages.length < 6 && (
                      <label className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition text-slate-400 hover:text-indigo-500">
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []) as File[];
                            const urls = files.map(f => URL.createObjectURL(f));
                            setGigImages(prev => [...prev, ...urls].slice(0, 6));
                          }}
                        />
                        <ImageIcon size={32} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Add Photo</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">GiG Title {isTypingGig && gigTitle && <span className="text-indigo-500">- Typing...</span>}</label>
                    <input 
                      type="text" 
                      id="gig-title"
                      ref={gigTitleRef}
                      value={gigTitle}
                      onChange={(e) => { setGigTitle(e.target.value); setIsTypingGig(true); }}
                      onBlur={() => setIsTypingGig(false)}
                      onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                      placeholder="E.G. WEB DEVELOPMENT"
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-sm uppercase tracking-wider text-slate-900" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Description {isTypingGig && gigDesc && <span className="text-indigo-500">- Typing...</span>}</label>
                    <textarea 
                      id="gig-desc"
                      value={gigDesc}
                      onChange={(e) => { setGigDesc(e.target.value); setIsTypingGig(true); }}
                      onBlur={() => setIsTypingGig(false)}
                      onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                      placeholder="DESCRIBE THE TASK..."
                      rows={3}
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-sm uppercase tracking-wider resize-none text-slate-900" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Budget (Coins) {isTypingGig && gigBudget && <span className="text-indigo-500">- Typing...</span>}</label>
                    <input 
                      type="number" 
                      id="gig-budget"
                      value={gigBudget}
                      onChange={(e) => { setGigBudget(e.target.value); setIsTypingGig(true); }}
                      onBlur={() => setIsTypingGig(false)}
                      onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                      placeholder="500"
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-black text-xl text-slate-900" 
                    />
                  </div>
              </div>
              </div>

              <button
                onClick={async () => {
                  if (!gigTitle || !gigBudget || !session) return;

                  const newGig = { 
                    title: gigTitle, 
                    description: gigDesc, 
                    price: `${gigBudget}`,
                    province: userProfile?.province || 'Gauteng',
                    location: userProfile?.location || 'Johannesburg',
                    category: 'Casual',
                    ownerId: session.user.id,
                    ownerName: userProfile?.name || 'User',
                    ownerAvatar: userProfile?.face_picture || '',
                    interestedCount: 0,
                    appliedCount: 0,
                    media: gigImages.map(url => ({ type: 'image', url }))
                  };

                  if (isSupabaseConfigured) {
                    const { data, error } = await supabase.from('gigs').insert([mapGigToDb(newGig)]).select();
                    if (!error && data) {
                      setGigs([mapGigFromDb(data[0]), ...gigs]);
                    }
                  } else {
                    setGigs([{ id: Date.now().toString(), ...newGig }, ...gigs]);
                  }

                  alert("GiG posted successfully! Reviewing...");
                  setShowCreateGig(false);
                  setGigImages([]);
                  setGigTitle('');
                  setGigDesc('');
                  setGigBudget('');
                }}
                className="w-full mt-8 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.25em] text-xs shadow-xl shadow-slate-200 hover:bg-indigo-600 transition"
              >
                Publish GiG
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {showPromoteModal && (
        <div 
          className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowPromoteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border border-red-500/20 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-red-600 to-black py-4 px-6 text-white text-center relative">
              <button 
                onClick={() => setShowPromoteModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-1"
              >
                <X size={18} />
              </button>
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl mx-auto flex items-center justify-center mb-1.5 border border-white/20">
                <Megaphone size={20} className="text-white animate-bounce" />
              </div>
              <h3 className="text-lg font-black tracking-tight">Fight Unemployment</h3>
              <p className="text-[10px] font-bold text-red-100 uppercase tracking-widest mt-0.5">Share TimeGiG With Community</p>
            </div>
            <div className="p-5 flex flex-col gap-3.5">
              <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl text-center">
                <p className="text-[11px] font-bold text-red-800 leading-snug">
                  Help your community eliminate unemployment by sharing simple casual jobs anyone can do!
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Referral Link</label>
                <div className="flex items-center gap-1.5">
                  <input 
                    type="text" 
                    readOnly
                    value={`https://gigs.co.za/join?ref=${userProfile?.name ? encodeURIComponent(userProfile?.name.toLowerCase()) : 'fighter'}`}
                    className="flex-1 py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 select-all outline-none"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://gigs.co.za/join?ref=${userProfile?.name ? encodeURIComponent(userProfile?.name.toLowerCase()) : 'fighter'}`);
                      alert("Referral link copied to clipboard!");
                    }}
                    className="py-2 px-3 bg-black text-white rounded-lg hover:bg-red-600 transition flex items-center gap-1 shrink-0 text-xs font-bold"
                  >
                    <Copy size={13} /> Copy
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Promotional Message</label>
                <textarea 
                  readOnly
                  rows={2}
                  value="Hey! Check out TimeGiG to find simple casual jobs anyone can do or hire local helpers. No CV needed. Let's fight unemployment together in South Africa! 🚀"
                  className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 leading-snug outline-none resize-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("Hey! Check out TimeGiG to find simple casual jobs anyone can do or hire local helpers. No CV needed. Let's fight unemployment together in South Africa! 🚀 https://timegig.co.za/join");
                    alert("Promotional text copied!");
                  }}
                  className="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-black transition font-black text-xs uppercase tracking-wider shadow flex items-center justify-center gap-1.5 mt-0.5 cursor-pointer"
                >
                  <Share2 size={14} /> Copy Message
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Heart className="text-red-500 animate-pulse shrink-0" size={18} />
                  <div>
                    <p className="text-xs font-black leading-none">Community Mission</p>
                    <p className="text-[9px] text-slate-400 mt-1">Promoting casual work for all</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-red-400 bg-red-950 px-2 py-0.5 rounded-full border border-red-800">Free</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
