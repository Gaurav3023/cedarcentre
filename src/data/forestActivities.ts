import { TreePine, Wind, Palette, Shield, Sparkles, Heart, Cloud, Moon, Sun, Anchor, Home, ChevronRight } from "lucide-react";

export interface Activity {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  task: string;
  type: 'breath' | 'color' | 'text' | 'shield' | 'grounding';
}

export const forestActivities: Activity[] = [
  // Chapter 1: The Quiet Glade (Foundations of Calm)
  { id: 1, title: "The Breathing Leaf", description: "Learn to calm your inner world.", icon: Wind, color: "bg-blue-50 text-blue-500", task: "Breathe in as the leaf grows, out as it shrinks. Do this 3 times.", type: 'breath' },
  { id: 2, title: "Mood Painting", description: "What color does your heart feel like?", icon: Palette, color: "bg-purple-50 text-purple-500", task: "Choose a color that matches your feeling today.", type: 'color' },
  { id: 3, title: "My Safe Bubble", description: "Imagine a soft, glowing bubble around you.", icon: Cloud, color: "bg-sky-50 text-sky-500", task: "Type one word that makes you feel safe.", type: 'text' },
  { id: 4, title: "The Worry Jar", description: "Give your heavy thoughts to the jar.", icon: Moon, color: "bg-indigo-50 text-indigo-500", task: "Type a worry you want to let go of.", type: 'text' },
  { id: 5, title: "Strength Shield", description: "Decorate your shield with inner powers.", icon: Shield, color: "bg-amber-50 text-amber-500", task: "Pick your strongest trait.", type: 'shield' },
  { id: 6, title: "Forest Gratitude", description: "Find small sparks of joy.", icon: Sparkles, color: "bg-rose-50 text-rose-500", task: "Write one thing you are thankful for.", type: 'text' },
  { id: 7, title: "The Grounding Tree", description: "Feel your roots deep in the earth.", icon: Anchor, color: "bg-emerald-50 text-emerald-500", task: "List 3 things you can see.", type: 'grounding' },
  { id: 8, title: "Heart Harmony", description: "Listen to the quiet beat of your heart.", icon: Heart, color: "bg-red-50 text-red-500", task: "Place your hand on your heart.", type: 'breath' },
  { id: 9, title: "Sunlight Secrets", description: "Catch the golden rays of positivity.", icon: Sun, color: "bg-yellow-50 text-yellow-600", task: "Write something nice about yourself.", type: 'text' },
  { id: 10, title: "The High Lookout", description: "Look how far you have come.", icon: TreePine, color: "bg-cedar-primary/10 text-cedar-primary", task: "What was your favorite step so far?", type: 'text' },

  // Chapter 2: The Rising Mist (Overcoming Shadows)
  { id: 11, title: "Starry Dreams", description: "Even in the dark, there are stars.", icon: Sparkles, color: "bg-indigo-50 text-indigo-400", task: "Write one thing you look forward to.", type: 'text' },
  { id: 12, title: "Listening Owl", description: "The forest is full of wisdom.", icon: Moon, color: "bg-slate-50 text-slate-500", task: "List 3 sounds you hear.", type: 'grounding' },
  { id: 13, title: "Gentle Stream", description: "Let your stress flow away.", icon: Wind, color: "bg-blue-50 text-blue-400", task: "Imagine a stream washing stress away.", type: 'text' },
  { id: 14, title: "Compass of Kindness", description: "Helping others helps us grow.", icon: Heart, color: "bg-rose-50 text-rose-400", task: "Who helped you feel safe this week?", type: 'text' },
  { id: 15, title: "Brave Mountain", description: "You are solid and unshakable.", icon: Anchor, color: "bg-emerald-50 text-emerald-600", task: "Say 'I am strong' 3 times.", type: 'breath' },
  { id: 16, title: "Echo of Peace", description: "Send a peaceful thought out.", icon: Cloud, color: "bg-sky-50 text-sky-400", task: "Type a peaceful word.", type: 'text' },
  { id: 17, title: "Morning Dew", description: "Every day is a fresh start.", icon: Sun, color: "bg-amber-50 text-amber-600", task: "What felt 'fresh' today?", type: 'text' },
  { id: 18, title: "Resilient Oak", description: "Bending but never breaking.", icon: TreePine, color: "bg-cedar-primary/10 text-cedar-primary", task: "What helps you stay strong?", type: 'text' },
  { id: 19, title: "Firefly Wishes", description: "Small lights in the woods.", icon: Sparkles, color: "bg-yellow-50 text-yellow-500", task: "Make a wish for someone.", type: 'text' },
  { id: 20, title: "The Mist Bridge", description: "Crossing into clarity.", icon: Shield, color: "bg-zinc-50 text-zinc-500", task: "What is one thing you're leaving behind?", type: 'text' },

  // Chapter 3: The Golden Grove (Self-Worth)
  { id: 21, title: "Mirror of Gold", description: "Seeing your true value.", icon: Sun, color: "bg-yellow-50 text-yellow-500", task: "Name a talent you have.", type: 'text' },
  { id: 22, title: "Kindness Seed", description: "Planting a thought for yourself.", icon: Heart, color: "bg-rose-50 text-rose-300", task: "What would you say to a friend?", type: 'text' },
  { id: 23, title: "Inner Sparkle", description: "Finding your unique light.", icon: Sparkles, color: "bg-amber-50 text-amber-400", task: "What makes you unique?", type: 'text' },
  { id: 24, title: "The Caring Nest", description: "Where do you feel nurtured?", icon: Home, color: "bg-orange-50 text-orange-400", task: "Describe a safe place.", type: 'text' },
  { id: 25, title: "Breath of Gold", description: "Inhaling light, exhaling doubt.", icon: Wind, color: "bg-yellow-100 text-yellow-600", task: "3 slow breaths of gold.", type: 'breath' },
  { id: 26, title: "Worthiness Well", description: "Drinking from the source of self-love.", icon: Anchor, color: "bg-blue-50 text-blue-300", task: "I am worthy because...", type: 'text' },
  { id: 27, title: "Crown of Leaves", description: "You are royalty in your own world.", icon: TreePine, color: "bg-emerald-50 text-emerald-400", task: "What are you proud of?", type: 'text' },
  { id: 28, title: "The Supportive Branch", description: "Who holds you up?", icon: Shield, color: "bg-slate-50 text-slate-400", task: "Name your 'safety person'.", type: 'text' },
  { id: 29, title: "Glow of Hope", description: "A light that never fades.", icon: Cloud, color: "bg-white text-yellow-500 border-yellow-100 shadow-sm", task: "What gives you hope?", type: 'text' },
  { id: 30, title: "The Golden Gate", description: "Entering the next realm of growth.", icon: Shield, color: "bg-brand-gradient text-white", task: "Say 'I am important'.", type: 'text' },

  // Chapter 4: The Whispering Wind (Communication)
  { id: 31, title: "Airy Affirmation", description: "Letting your voice fly.", icon: Wind, color: "bg-sky-50 text-sky-400", task: "Type a kind statement about you.", type: 'text' },
  { id: 32, title: "The Truth Feather", description: "Weightless and honest.", icon: Wind, color: "bg-slate-50 text-slate-400", task: "What is one truth you feel today?", type: 'text' },
  { id: 33, title: "Listening Leaves", description: "Hearing the unspoken.", icon: Moon, color: "bg-green-50 text-green-500", task: "List 2 things you hear right now.", type: 'grounding' },
  { id: 34, title: "The Calm Gust", description: "Blowing away the noise.", icon: Wind, color: "bg-indigo-50 text-indigo-300", task: "Take a deep 'whoosh' breath.", type: 'breath' },
  { id: 35, title: "Voice of Courage", description: "Speaking your needs clearly.", icon: Shield, color: "bg-red-50 text-red-400", task: "What do you need right now?", type: 'text' },
  { id: 36, title: "The Silken Breeze", description: "Softness in your words.", icon: Heart, color: "bg-pink-50 text-pink-400", task: "Write a soft word.", type: 'text' },
  { id: 37, title: "Wind Chime Harmony", description: "Finding your rhythm.", icon: Sparkles, color: "bg-yellow-50 text-yellow-400", task: "Hum a peaceful note.", type: 'breath' },
  { id: 38, title: "Carried Away", description: "Letting non-helpers drift off.", icon: Cloud, color: "bg-blue-50 text-blue-200", task: "What thought can drift away?", type: 'text' },
  { id: 39, title: "The Updraft", description: "Rising above the struggle.", icon: Wind, color: "bg-emerald-50 text-emerald-500", task: "What makes you feel light?", type: 'text' },
  { id: 40, title: "Storm Breaker", description: "Calm within the wind.", icon: Shield, color: "bg-slate-800 text-white", task: "I can handle this. Repeat.", type: 'text' },

  // Chapter 5: The Crystal Lake (Clarity)
  { id: 41, title: "Clear Reflection", description: "Seeing the calm surface.", icon: Palette, color: "bg-blue-50 text-blue-500", task: "Observe your breathing.", type: 'breath' },
  { id: 42, title: "Still Water", description: "Peace in the depths.", icon: Anchor, color: "bg-sky-50 text-sky-300", task: "Don't move for 10 seconds.", type: 'grounding' },
  { id: 43, title: "Crystal Vision", description: "Focusing on the good.", icon: Sparkles, color: "bg-cyan-50 text-cyan-400", task: "What is clear to you today?", type: 'text' },
  { id: 44, title: "Pebble in Pond", description: "Understanding your impact.", icon: Heart, color: "bg-indigo-50 text-indigo-400", task: "Write one nice act you did.", type: 'text' },
  { id: 45, title: "Lake of Calm", description: "Washing the mind.", icon: Wind, color: "bg-blue-100 text-blue-600", task: "Breathe with the waves.", type: 'breath' },
  { id: 46, title: "Diving Deep", description: "Finding your inner treasure.", icon: Moon, color: "bg-slate-700 text-white", task: "What is your best quality?", type: 'text' },
  { id: 47, title: "Water Lily", description: "Floating with ease.", icon: Cloud, color: "bg-rose-50 text-rose-400", task: "I am at peace.", type: 'text' },
  { id: 48, title: "Frozen Moment", description: "Pausing for safety.", icon: Shield, color: "bg-zinc-100 text-zinc-500", task: "Take a 5 second pause.", type: 'grounding' },
  { id: 49, title: "The Blue Ripple", description: "Small steps, big change.", icon: Wind, color: "bg-blue-50 text-blue-400", task: "What is one small goal?", type: 'text' },
  { id: 50, title: "Mirror Mastery", description: "Brave eyes looking back.", icon: Shield, color: "bg-brand-gradient text-white", task: "I am brave. Say it.", type: 'text' },

  // Chapter 6: The Ancient Peak (Resilience)
  { id: 51, title: "Mountain Breath", description: "Huge, steady inhalations.", icon: Wind, color: "bg-slate-100 text-slate-600", task: "Deep breath in, hold 2s.", type: 'breath' },
  { id: 52, title: "Solid Ground", description: "Feet firm on the mountain.", icon: Anchor, color: "bg-stone-100 text-stone-600", task: "Push your feet into the floor.", type: 'grounding' },
  { id: 53, title: "Peak Perspective", description: "Seeing the big picture.", icon: Sun, color: "bg-yellow-50 text-yellow-600", task: "I am larger than my fear.", type: 'text' },
  { id: 54, title: "Snowy Peace", description: "The silence of the summit.", icon: Cloud, color: "bg-slate-50 text-slate-300", task: "Imagine quiet snow falling.", type: 'text' },
  { id: 55, title: "Eagle's Eye", description: "Watching with wisdom.", icon: Sparkles, color: "bg-amber-50 text-amber-600", task: "Focus on one tiny object.", type: 'grounding' },
  { id: 56, title: "Climbing Higher", description: "Every step is a win.", icon: ChevronRight, color: "bg-emerald-50 text-emerald-500", task: "List a 'hard' thing you did.", type: 'text' },
  { id: 57, title: "Stone Strength", description: "Unbreakable spirit.", icon: Shield, color: "bg-slate-300 text-slate-800", task: "I am strong like stone.", type: 'text' },
  { id: 58, title: "Peak Silence", description: "Calming the mental storm.", icon: Moon, color: "bg-indigo-900 text-white", task: "Count backward 5-1.", type: 'grounding' },
  { id: 59, title: "Above the Clouds", description: "Light in the highest place.", icon: Sun, color: "bg-orange-50 text-orange-500", task: "What makes you glow?", type: 'text' },
  { id: 60, title: "Summit Ceremony", description: "You are the mountain.", icon: Shield, color: "bg-brand-gradient text-white", task: "I have reached the peak.", type: 'text' },

  // Chapter 7: The Sky Home (Freedom)
  { id: 61, title: "Flight of Fancy", description: "Letting dreams soar.", icon: Sparkles, color: "bg-sky-50 text-sky-400", task: "If you could fly, where to?", type: 'text' },
  { id: 62, title: "Cloud Writing", description: "Words in the sky.", icon: Cloud, color: "bg-slate-50 text-slate-400", task: "Write a dream in the clouds.", type: 'text' },
  { id: 63, title: "Starlight Shield", description: "Protected by the cosmos.", icon: Shield, color: "bg-indigo-50 text-indigo-500", task: "I am cosmic and safe.", type: 'text' },
  { id: 64, title: "Eternal Breath", description: "The universe within.", icon: Wind, color: "bg-purple-50 text-purple-600", task: "Infinite, slow breathing.", type: 'breath' },
  { id: 65, title: "Cosmic Connection", description: "Never truly alone.", icon: Heart, color: "bg-rose-50 text-rose-500", task: "I am part of something big.", type: 'text' },
  { id: 66, title: "Horizon Gaze", description: "Looking at the future.", icon: Sun, color: "bg-amber-50 text-amber-500", task: "The future is bright.", type: 'text' },
  { id: 67, title: "Meteor Magic", description: "Quick bursts of joy.", icon: Sparkles, color: "bg-yellow-50 text-yellow-400", task: "What was a bright moment?", type: 'text' },
  { id: 68, title: "Aurora Calm", description: "Colors of the spirit.", icon: Palette, color: "bg-emerald-50 text-emerald-400", task: "Pick a 'safe' light color.", type: 'color' },
  { id: 69, title: "The Hero's Heart", description: "The engine of your journey.", icon: Heart, color: "bg-red-500 text-white", task: "I am a hero. Repeat.", type: 'text' },
  { id: 70, title: "Final Haven", description: "You have arrived. You are home.", icon: TreePine, color: "bg-blue-500 text-white", task: "How does it feel to be home?", type: 'text' },

  // Chapter 8: The Velvet Valley (Softness)
  { id: 71, title: "Soft Touch", description: "Gentleness starts within.", icon: Wind, color: "bg-pink-50 text-pink-400", task: "Touch something soft. How does it feel?", type: 'grounding' },
  { id: 72, title: "Kind Whispers", description: "Speaking softly to your heart.", icon: Moon, color: "bg-slate-50 text-slate-400", task: "Whisper 'I am safe' slowly.", type: 'breath' },
  { id: 73, title: "Velvet Vision", description: "Seeing the world with kindness.", icon: Sun, color: "bg-rose-50 text-rose-300", task: "Name 2 beautiful things.", type: 'text' },
  { id: 74, title: "Gentle Giant", description: "Strength in softness.", icon: Anchor, color: "bg-stone-50 text-stone-400", task: "I can be strong and soft.", type: 'text' },
  { id: 75, title: "Cotton Cloud", description: "Floating over the noise.", icon: Cloud, color: "bg-white border-2 border-slate-100", task: "Imagine a fluffy cloud.", type: 'text' },
  { id: 76, title: "Pillow Peace", description: "Finding rest anywhere.", icon: Heart, color: "bg-indigo-50 text-indigo-300", task: "Take a restful breath.", type: 'breath' },
  { id: 77, title: "The Silk Road", description: "A smooth path ahead.", icon: ChevronRight, color: "bg-sky-50 text-sky-300", task: "What is a smooth thing in life?", type: 'text' },
  { id: 78, title: "Feather Fall", description: "Landing softly on your feet.", icon: Wind, color: "bg-zinc-50 text-zinc-400", task: "Let out a long breath.", type: 'breath' },
  { id: 79, title: "Cradle of Calm", description: "Held by the universe.", icon: Moon, color: "bg-slate-800 text-white", task: "I am held and loved.", type: 'text' },
  { id: 80, title: "Velvet Victory", description: "Hard things made soft.", icon: Shield, color: "bg-pink-500 text-white", task: "I conquered a hard day.", type: 'text' },

  // Chapter 9: The Prismatic Path (Emotions)
  { id: 81, title: "Rainbow Ray", description: "Every color is a feeling.", icon: Palette, color: "bg-red-50 text-red-400", task: "What color is 'joy'?", type: 'color' },
  { id: 82, title: "Crystal Prism", description: "Splitting the heavy light.", icon: Sparkles, color: "bg-blue-50 text-blue-400", task: "Turn a worry into a lesson.", type: 'text' },
  { id: 83, title: "Neon Hopes", description: "Bright dreams in the dark.", icon: Sun, color: "bg-yellow-50 text-yellow-500", task: "What is a bright dream?", type: 'text' },
  { id: 84, title: "The Blue Glow", description: "Peaceful reflection.", icon: Cloud, color: "bg-blue-50 text-blue-600", task: "I am calm like blue.", type: 'text' },
  { id: 85, title: "Green Growth", description: "Ever-changing, always alive.", icon: TreePine, color: "bg-green-50 text-green-600", task: "How have you grown today?", type: 'text' },
  { id: 86, title: "Purple Peace", description: "Deep, quiet stillness.", icon: Moon, color: "bg-purple-50 text-purple-600", task: "Imagine a purple sunset.", type: 'text' },
  { id: 87, title: "Orange Energy", description: "The fire of resilience.", icon: Wind, color: "bg-orange-50 text-orange-500", task: "I am full of energy.", type: 'text' },
  { id: 88, title: "Silver Lining", description: "The light behind the cloud.", icon: Sparkles, color: "bg-slate-100 text-slate-500", task: "What is one good thing today?", type: 'text' },
  { id: 89, title: "Spectrum Soul", description: "You are all the colors.", icon: Palette, color: "bg-brand-gradient text-white", task: "I love all parts of me.", type: 'text' },
  { id: 90, title: "Prismatic Peak", description: "Coloring your world.", icon: Shield, color: "bg-indigo-600 text-white", task: "I am a masterpiece.", type: 'text' },

  // Chapter 10: The Echoing Cave (Inner Shadows)
  { id: 91, title: "Safe Echo", description: "Hearing your own strength.", icon: Wind, color: "bg-slate-500 text-white", task: "Say 'I am here' and hear it.", type: 'text' },
  { id: 92, title: "Cave Spark", description: "Light in the deep.", icon: Sun, color: "bg-amber-100 text-amber-600", task: "What is your internal spark?", type: 'text' },
  { id: 93, title: "Sound of Silence", description: "Comfort in the quiet.", icon: Moon, color: "bg-slate-900 text-white", task: "Listen to your pulse.", type: 'grounding' },
  { id: 94, title: "Stone Secret", description: "Solid truths held deep.", icon: Anchor, color: "bg-stone-200 text-stone-700", task: "Write a secret strength.", type: 'text' },
  { id: 95, title: "Drip of Peace", description: "Slow, steady progress.", icon: Wind, color: "bg-blue-50 text-blue-400", task: "Breathe with a slow drip count.", type: 'breath' },
  { id: 96, title: "Shadow Dance", description: "Making peace with fear.", icon: Moon, color: "bg-slate-800 text-slate-200", task: "I am not afraid of shadows.", type: 'text' },
  { id: 97, title: "Crystal Find", description: "Treasure in the dark.", icon: Sparkles, color: "bg-purple-100 text-purple-600", task: "What is a hidden gift you have?", type: 'text' },
  { id: 98, title: "Cave Comfort", description: "A home inside yourself.", icon: Home, color: "bg-emerald-900 text-white", task: "I am my own safe space.", type: 'text' },
  { id: 99, title: "Resonance", description: "Feeling your vibrations.", icon: Heart, color: "bg-rose-900 text-white", task: "Hum deeply for 5 seconds.", type: 'breath' },
  { id: 100, title: "Underground Gem", description: "Polished by pressure.", icon: Shield, color: "bg-brand-gradient text-white", task: "Pressure made me a gem.", type: 'text' },

  // Chapter 11: Solar Summit (Pure Joy)
  { id: 101, title: "Solar Inhale", description: "Breathing in the fire.", icon: Wind, color: "bg-yellow-50 text-yellow-600", task: "Breathe in warmth.", type: 'breath' },
  { id: 102, title: "Beam of Light", description: "Focused positive energy.", icon: Sun, color: "bg-orange-50 text-orange-600", task: "I radiate happiness.", type: 'text' },
  { id: 103, title: "Golden Grains", description: "Small bits of brilliance.", icon: Sparkles, color: "bg-amber-100 text-amber-700", task: "List 5 small wins today.", type: 'text' },
  { id: 104, title: "Burn Bright", description: "Never losing your flame.", icon: Heart, color: "bg-red-50 text-red-600", task: "I will keep shining.", type: 'text' },
  { id: 105, title: "Sun Dance", description: "Moving with the light.", icon: Sparkles, color: "bg-yellow-400 text-white", task: "Stretch your arms up high.", type: 'grounding' },
  { id: 106, title: "Light Speed", description: "Quick positive thoughts.", icon: ChevronRight, color: "bg-orange-400 text-white", task: "Say 'Yes' to today.", type: 'text' },
  { id: 107, title: "Flare of Hope", description: "A beacon for others.", icon: Sun, color: "bg-yellow-600 text-white", task: "What can you share with others?", type: 'text' },
  { id: 108, title: "Infinite Summer", description: "A heart that stays warm.", icon: Heart, color: "bg-rose-50 text-rose-500", task: "I feel warm inside.", type: 'text' },
  { id: 109, title: "Ablaze", description: "Passionate and alive.", icon: Wind, color: "bg-red-600 text-white", task: "What is one project you love?", type: 'text' },
  { id: 110, title: "Solar Flare Mastery", description: "Crowning of the Light.", icon: Shield, color: "bg-brand-gradient text-white", task: "I am the light.", type: 'text' },

  // Chapter 12: Cosmic Cradle (Transcendence)
  { id: 111, title: "Galaxy Gaze", description: "Vast and peaceful.", icon: Sparkles, color: "bg-slate-900 text-blue-300", task: "Imagine the stars.", type: 'text' },
  { id: 112, title: "Nebula Nap", description: "Resting in the clouds.", icon: Cloud, color: "bg-indigo-900 text-indigo-300", task: "Take a deep space breath.", type: 'breath' },
  { id: 113, title: "Comet Catch", description: "Speeding toward the future.", icon: ChevronRight, color: "bg-sky-900 text-white", task: "Where are you going next?", type: 'text' },
  { id: 114, title: "Moonlight Muse", description: "Inspired by the night.", icon: Moon, color: "bg-slate-800 text-white border border-slate-700", task: "What inspires you?", type: 'text' },
  { id: 115, title: "Orbiting Soul", description: "Steady and eternal.", icon: Anchor, color: "bg-blue-900 text-blue-200", task: "I am steady and constant.", type: 'text' },
  { id: 116, title: "Supernova Smile", description: "Explosive positivity.", icon: Sun, color: "bg-yellow-900 text-yellow-300", task: "Smile as big as you can.", type: 'grounding' },
  { id: 117, title: "Infinite Void", description: "Nothingness is peaceful.", icon: Wind, color: "bg-black text-white border border-slate-800", task: "Feel the silence.", type: 'grounding' },
  { id: 118, title: "Star Dust", description: "We are all made of light.", icon: Sparkles, color: "bg-purple-900 text-white", task: "I am made of stars.", type: 'text' },
  { id: 119, title: "Universal Heart", description: "Beating with the cosmos.", icon: Heart, color: "bg-rose-900 text-white", task: "I am one with everything.", type: 'text' },
  { id: 120, title: "The Hero of Infinity", description: "You have completed the grand path.", icon: Shield, color: "bg-brand-gradient text-white shadow-2xl", task: "You have walked 120 steps. You are a Legend.", type: 'text' },
];
