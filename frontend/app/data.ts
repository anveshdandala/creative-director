import { CreativePlan, DirectorReview } from "./types";

export type PresetExample = {
  id: string;
  name: string;
  contentType: string;
  platform: string;
  idea: string;
  plan: CreativePlan;
  review: DirectorReview;
};

export const PRESET_EXAMPLES: PresetExample[] = [
  {
    id: "fitness-reel",
    name: "Motivational Fitness Reel",
    contentType: "Video/Reel",
    platform: "Instagram Reels",
    idea: "I want to create a motivational fitness reel showing early morning hustle for gym beginners.",
    plan: {
      title: "Rise Before the Excuses",
      concept:
        "Contrasting the quiet stillness of 5 AM with the physical power of the workout. The progression goes from slow, moody prep to fast-paced, high-effort exertion, emphasizing the emotional shift from fatigue to triumph.",
      targetAudience:
        "Gym beginners and people struggling with consistency. They need an empathetic but firm reminder that the hardest part is simply waking up and showing up.",
      aesthetic: {
        colorPalette: ["#1e293b", "#f97316", "#e2e8f0"],
        visualVibe:
          "Moody, high-contrast, atmospheric. Cinematic blue hour shadows transitioning to warm, high-intensity spotlighting.",
        lighting:
          "Cool early morning natural light through window, shifting to high-contrast overhead gym lighting highlighting physical motion.",
      },
      hooks: [
        "On-Screen text: 'The alarm at 5 AM is a choice.' Verbal call: 'You have two voices in your head right now. Which one are you listening to?'",
        "On-Screen text: 'Don't scroll if you slept in.' Verbal call: 'This is your sign that tomorrow is a fresh start.'",
      ],
      storyboard: [
        {
          shot: 1,
          description:
            "Close-up of alarm clock turning to 5:00 AM, in dark, cool lighting. A hand reaches out and presses snooze, but then immediately sits up, showing tension.",
          duration: "0-3s",
          angle: "Macro close-up, shallow depth of field",
        },
        {
          shot: 2,
          description:
            "Slipping on running shoes. The camera sits on the floor. Tightening the laces, breathing heavily. Transition to walking out the front door into the dawn twilight.",
          duration: "3-6s",
          angle: "Low angle floor shot, tracking",
        },
        {
          shot: 3,
          description:
            "High-intensity workout montage. 3 rapid cuts: pulling a heavy barbell (exhale), water splashing on face, sweat dripping. Dynamic pacing matches the sound beat.",
          duration: "6-9s",
          angle: "Medium shot with hand-held camera shake",
        },
        {
          shot: 4,
          description:
            "Slowing down. Standing tall under the gym light, looking at the camera with a subtle, confident smile of accomplishment. Quick fade to black.",
          duration: "9-12s",
          angle: "Slight low-angle hero shot, central framing",
        },
      ],
      music: {
        genre: "Cinematic hybrid orchestral-trap",
        tempo: "Shifts from 80bpm slow-build to 140bpm energetic drop",
        vibe: "Starts with emotional piano chords, building with ticking clocks, exploding into a heavy, rhythmic bass drop.",
      },
      platformTips: {
        instagram:
          "Keep the text overlay centered within the safe zones. Use Instagram's native typewriter font for the hook. Pair with trending motivational audio.",
        tiktok:
          "Use TikTok's text-to-speech voice for the first 2 seconds to boost engagement. Use rapid transitions on the beat drop.",
      },
    },
    review: {
      scores: {
        composition: "A-",
        lighting: "B+",
        hook: "A",
        pacing: "B",
      },
      feedback: {
        whatIsWorking:
          "The emotional arc is exceptionally clear. Waking up feels authentic rather than glorified. The close-up shoe-lacing shot provides a sensory trigger that anchors the audience in the physical moment. The hook hits exactly the right emotional note.",
        areasToImprove:
          "The transitional shot from walking out the door to being in the gym feels too abrupt. Consider adding a quick 1-second 'in-transit' shot (e.g. driving or holding gym keys) to smooth the pacing. Increase contrast in the workout montage to make the sweat and metallic details pop.",
        directorNotes:
          "This has incredible potential to go viral because it focuses on the internal struggle, which is universally relatable. Keep the camera close and raw — don't over-edit or add cheesy transition effects.",
      },
      captions: [
        {
          text: "The alarm at 5 AM isn't just a sound. It's the first decision of your day. Will you negotiate with your excuses, or will you show up? Tomorrow morning is a blank page. Let's write it right. 👇 #BeginnerGym #MorningRoutine",
          vibe: "Bold & Motivating",
        },
        {
          text: "Every single fitness creator makes it look easy. It's not. Getting out of bed when it's cold and dark is a mental battle. If you lost that battle today, that's okay. Watch this and let's win tomorrow together. Save this for your 5 AM alarm reminder. 🌅",
          vibe: "Story-driven & Empathetic",
        },
      ],
      hashtags: [
        "GymMotivation",
        "BeginnerFitness",
        "MorningRoutine",
        "ShowUpForYourself",
        "DisciplineOverMotivation",
      ],
      postingStrategy: {
        bestTime: "Sundays at 8:00 PM or Weekdays at 5:30 AM",
        rationale:
          "Sunday evening is when people plan their weekly goals and feel guilt about resting. 5:30 AM is perfect to catch 'alarm-scrollers' who are currently lying in bed debating whether to get up.",
      },
    },
  },
  {
    id: "artisan-coffee",
    name: "Artisan Coffee Brewing Tutorial",
    contentType: "Video/Reel",
    platform: "TikTok",
    idea: "A calm, satisfying, ASMR-style V60 pour-over coffee tutorial focusing on the slow-living aesthetic.",
    plan: {
      title: "The Art of Slow Pour",
      concept:
        "A relaxing, visual-first guide that frames coffee making not as a morning chore, but as a mindful daily ritual. Emphasizes clean surfaces, natural wood textures, and rich acoustic sound design (ASMR).",
      targetAudience:
        "Coffee hobbyists, slow-living enthusiasts, and people who crave satisfying, calming videos. They watch for both information and visual relaxation.",
      aesthetic: {
        colorPalette: ["#FAF7F2", "#5C4033", "#D2B48C"],
        visualVibe:
          "Wabi-Sabi, minimalistic, warm, cozy. Earthy wood tones, soft ceramics, and bright warm ambient backlight.",
        lighting:
          "Soft, diffused morning window light (side-lit) to cast gentle, warm shadows across the brewing equipment.",
      },
      hooks: [
        "On-Screen text: '3 mistakes ruining your pour-over.' Verbal call: (Silent, instead uses the satisfying sound of a coffee grinder crunching beans).",
        "On-Screen text: 'Pour-over coffee is active meditation.' Verbal call: 'Stop rushing your mornings. Let's brew a cup together.'",
      ],
      storyboard: [
        {
          shot: 1,
          description:
            "Close-up of whole coffee beans pouring into a high-end hand grinder. Visual focus is extremely sharp on the texture of the oily beans.",
          duration: "0-3s",
          angle: "Top-down close-up, slow motion",
        },
        {
          shot: 2,
          description:
            "Satisfying close-up of water meeting the coffee grounds. The coffee swells and bubbles (the bloom phase). The camera catches steam rising into the sunlight.",
          duration: "3-6s",
          angle: "Extreme macro, side angle",
        },
        {
          shot: 3,
          description:
            "A steady, circular pour from a sleek copper goose-neck kettle. The swirling vortex of coffee and water creates a beautiful spiral.",
          duration: "6-9s",
          angle: "Overhead top-down, locked tripod",
        },
        {
          shot: 4,
          description:
            "Pouring the rich amber liquid from the carafe into a handmade ceramic mug. The steam rises, and the shot lingers on the filled cup resting on a warm wooden table.",
          duration: "9-12s",
          angle: "Eye-level medium shot, slow zoom-out",
        },
      ],
      music: {
        genre: "Lo-fi jazz hop or acoustic fingerstyle guitar",
        tempo: "Very slow, relaxed 70bpm",
        vibe: "Soft acoustic notes that compliment rather than override the natural pouring and bubbling ASMR sounds.",
      },
      platformTips: {
        instagram:
          "Perfect for Instagram's 'aesthetic' niches. Do not over-explain in the video; write the full step-by-step recipe in the caption.",
        tiktok:
          "Use high-quality microphone placement to capture crisp water pours and grinding sounds. Post with original audio and use ASMR tags.",
      },
    },
    review: {
      scores: {
        composition: "A",
        lighting: "A-",
        hook: "B+",
        pacing: "A",
      },
      feedback: {
        whatIsWorking:
          "The visual quality is stunning. The side-lighting from the window highlights the water stream and rising steam perfectly. Pacing is exceptionally calming, giving each action room to breathe.",
        areasToImprove:
          "While the ASMR sounds are great, the visual hook could be slightly faster. The first shot of beans pouring takes 3 seconds; try cutting it to 1.5 seconds and immediately transition to the bloom to capture short attention spans.",
        directorNotes:
          "Excellent slow-living piece. To boost shareability, add very clean, minimalist serif-font subtitle overlays for the coffee-to-water ratio (e.g. '15g Coffee / 250g Water').",
      },
      captions: [
        {
          text: "Pour-over isn’t coffee. It’s 5 minutes of active meditation before the day gets noisy. Save this recipe for your next slow morning: ☕️ 15g beans, medium-coarse grind | 🌡 93°C water | ⏱ 3:00 total brew time. #V60 #SlowLiving",
          vibe: "Calming & Educational",
        },
        {
          text: "If your morning feels like a race, try shifting one habit. Instead of instant coffee while checking emails, spend five minutes brewing. No screens, just the sound of water and the smell of fresh grounds. ✨ #CoffeeASMR #MindfulMornings",
          vibe: "Lifestyle-focused",
        },
      ],
      hashtags: [
        "CoffeeASMR",
        "SlowPour",
        "V60PourOver",
        "SlowLiving",
        "MindfulMornings",
      ],
      postingStrategy: {
        bestTime: "Saturdays and Sundays between 7:30 AM - 9:30 AM",
        rationale:
          "This matches the relaxed weekend morning routine when viewers are in bed or enjoying their own slow morning scroll.",
      },
    },
  },
];
