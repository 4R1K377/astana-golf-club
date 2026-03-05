// script.js
document.addEventListener('DOMContentLoaded', () => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const byId = (id) => document.getElementById(id);

  // ============================================================
  // supabase config
  // ============================================================
  const SUPABASE_URL = 'https://hbmkeqhuvjabxplesjhl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhibWtlcWh1dmphYnhwbGVzamhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTg3NzksImV4cCI6MjA4ODI3NDc3OX0.Fke5Z1rNKethLDFwB45qM8y_cuMq7QXmHai2z0qXMdc';

  let supabase = null;
  try {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  } catch (e) {
    console.error('supabase init failed:', e);
  }

  // ============================================================
  // shared elements
  // ============================================================
  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');
  const menuLabel = menuToggle ? $('.menu-label', menuToggle) : null;
  const menuNav = byId('main-navigation');
  const logoImage = $('.logo img');

  const holeModal = byId('hole-modal');
  const holeModalSheet = holeModal ? $('.hole-modal-sheet', holeModal) : null;
  const holeModalTitle = byId('hole-modal-title');
  const holeModalBody = byId('hole-modal-body');
  const holeModalPar = byId('hole-modal-par');
  const holeModalHandicap = byId('hole-modal-handicap');
  const holeYardageBlack = byId('hole-yardage-black');
  const holeYardageGold = byId('hole-yardage-gold');
  const holeYardageBlue = byId('hole-yardage-blue');
  const holeYardageRed = byId('hole-yardage-red');

  let isMenuOpen = false;
  let isHoleModalOpen = false;
  let isAuthModalOpen = false;
  let lastFocusedElementBeforeModal = null;

  // ============================================================
  // hole details (golf page)
  // ============================================================
  const holeDetails = {
    1:{title:'Hole 1 — The Opener',par:4,handicap:7,yardages:{black:430,gold:393,blue:358,red:319},body:['The opening hole is a visually narrow par 4 that immediately asks for precision from the tee. Mature trees line both sides of the fairway, creating a defined corridor and placing an emphasis on accuracy rather than distance. A water hazard runs along the right side of the hole, while strategically placed bunkers on both sides punish drives that stray offline.','The fairway gently guides play toward a well-protected green. Approaches must navigate a cluster of bunkers guarding the front and right side, with additional sand set behind the putting surface to catch shots struck with too much aggression. Trees close to the green further tighten the target area, demanding a controlled and well-shaped second shot.','The green itself is subtly contoured and rewards approaches played from the correct side of the fairway. While not long on the scorecard, the hole often plays into the wind, making thoughtful club selection and positioning essential. Crosswind Corridor provides a demanding yet fair introduction to the course, setting the strategic tone from the very first hole.']},
    2:{title:'Hole 2 — The Sentinel',par:3,handicap:9,yardages:{black:190,gold:190,blue:170,red:148},body:['This par 3 appears straightforward from the tee, but its true defense reveals itself closer to the green. While the water to the left provides a visual reference, it is the large, mature tree near the right side of the green that defines the character of the hole and gives it its name.','When the pin is tucked on the right, the tree acts as a true sentinel, guarding the preferred angle and punishing any shot that drifts slightly off line. Tee shots finishing on the wrong side of the green leave a restricted approach, often forcing a high, delicate recovery or a conservative play back toward the center.','The safest and most reliable strategy is a committed shot toward the middle of the putting surface, where the green opens up and the tree\'s influence is minimized. The Sentinel rewards discipline and awareness rather than aggression, reminding players that not all danger is obvious from the tee.']},
    3:{title:'Hole 3 — The Bend',par:4,handicap:1,yardages:{black:401,gold:379,blue:342,red:301},body:['This par 4 follows a gentle curve and is shaped by water on both the drive and the approach. A narrow stream traces the left side of the fairway, visually guiding the tee shot while quietly punishing anything pulled offline. The fairway is generous in places, but its angle encourages a controlled drive rather than full aggression.','The approach is where the hole truly asserts itself. A large water hazard guards the right side of the green, while a series of bunkers line the approach and right flank, tightening the landing area. Shots played safely left avoid the water but must contend with a more demanding angle into the putting surface.','The green is subtly contoured and rewards approaches struck with confidence and precision. With water, sand, and trees all influencing play, Water\'s Bend is a strategic par 4 that asks the golfer to think carefully on both shots, balancing risk and reward from tee to green.']},
    4:{title:'Hole 4 — Narrow Line',par:3,handicap:15,yardages:{black:147,gold:144,blue:120,red:91},body:['This par 3 is defined by the presence of water along the left side, which runs the full length of the hole and provides a strong visual boundary from tee to green. While the water is not directly in play for most shots, it subtly influences alignment and club selection, especially under windy conditions.','The green is set safely to the right of the stream and is protected by a bunker guarding the front-right portion of the putting surface. Trees around the green frame the target and place an emphasis on accuracy, particularly for shots that miss long or right. The ideal tee shot is played confidently toward the center of the green, away from both sand and water.','Although it appears straightforward, this hole demands focus and precise distance control. Streamside rewards a composed tee shot and offers a fair scoring opportunity for players who commit fully to their line.']},
    5:{title:'Hole 5 — The Route',par:5,handicap:5,yardages:{black:542,gold:504,blue:478,red:424},body:['This par 5 is shaped by water and strategic positioning, encouraging thoughtful play from the tee. A large water hazard comes into view early on the left side, influencing the driving line and narrowing the ideal landing area. The safest play favors the right side of the fairway, setting up a more comfortable second shot.','Further along the hole, the fairway tightens and demands clear decision-making on the second shot. Players must choose between a conservative lay-up or a more aggressive advance to gain a stronger position for the approach. Bunkers positioned along both sides reward commitment and punish hesitation.','The approach into the green is protected by bunkers, with no water in play beyond the putting surface. Accurate positioning on the fairway is essential to access the safest angle into the green. Waterside Route is a classic three-shot par 5 that rewards patience, discipline, and smart course management.']},
    6:{title:'Hole 6 — Pond',par:3,handicap:11,yardages:{black:166,gold:166,blue:159,red:117},body:['This par 3 is defined by a large water hazard that dominates the center of the hole and immediately captures the player\'s attention from the tee. The green sits beyond the water, requiring a confident carry and precise distance control. While the fairway areas around the hole offer some margin, any shot struck without full commitment risks finding the water.','Bunkers protect the green and gather shots that miss their target, while scattered trees frame the hole and influence recovery options. The safest play is toward the heart of the green, avoiding both the water short and the sand surrounding the putting surface.','Despite its straightforward appearance, this hole demands trust in club selection and execution. Still Water is a classic par 3 where hesitation is punished, and a well-struck tee shot is rewarded with a genuine birdie opportunity.']},
    7:{title:'Hole 7 — Long Shore',par:4,handicap:3,yardages:{black:411,gold:370,blue:340,red:301},body:['This par 4 runs alongside a large water hazard on the left, which remains in play for much of the hole and strongly influences both strategy and shot shape. From the tee, the fairway encourages a drive favoring the right side, as anything pulled left risks finding the water. Bunkers and trees on the right punish overly conservative lines, creating a well-balanced challenge.','The second shot is played toward a green that sits safely beyond the water but remains visually influenced by it. Bunkers around the approach area tighten the landing zone, rewarding players who position their drive correctly. Trees further frame the approach and can complicate recovery shots for those out of position.','While not overly long, this hole demands discipline and controlled shot-making. Long Shore favors players who respect the water, commit to their line, and maintain accuracy from tee to green.']},
    8:{title:'Hole 8 — Opportunity',par:4,handicap:17,yardages:{black:305,gold:282,blue:282,red:252},body:['This short par 4 is the most approachable hole on the course and offers a genuine scoring opportunity. While a stream runs along the left side of the fairway, the hole provides ample room for a confident tee shot, allowing players to favor position rather than power.','The approach is straightforward, with a clear view of the green and minimal visual intimidation. Bunkers around the putting surface reward solid distance control but allow for simple recovery shots. The green is receptive and encourages aggressive play for those looking to attack the pin.','Open Passage invites players to play freely and build momentum, standing in contrast to the more demanding holes around it. Precision is still rewarded, but this hole offers a welcome chance to score early.']},
    9:{title:'Hole 9 — The Boundary',par:5,handicap:13,yardages:{black:509,gold:482,blue:449,red:418},body:['This par 5 provides a strong and demanding finish to the front nine, with out of bounds running along the left side beyond the cart path. From the tee, players must commit to their line, as anything pushed too far left risks finding OB, while the fairway itself offers sufficient width for a confident, well-shaped drive.','The hole rewards positioning over power. Bunkers placed along the fairway challenge aggressive play and guide decision-making on the second shot. Players can choose to advance boldly or lay up to a preferred distance, but accuracy becomes increasingly important as the hole progresses.','The approach into the green is protected by bunkers and subtle contours that place a premium on distance control. With OB lingering on the left and hazards tightening near the green, The Boundary demands focus through all three shots, offering a rewarding birdie opportunity only to those who manage risk effectively.']},
    10:{title:'Hole 10 — Nightmare',par:5,handicap:4,yardages:{black:581,gold:560,blue:534,red:499},body:['This par 5 begins the back nine with a clear emphasis on positioning and patience. A stream runs closely along the right side of the hole for much of its length, providing a strong visual guide and a constant strategic presence from tee to green. The left side offers more room, making it the safer option for the opening drive.','From the tee, the fairway is generous, encouraging a confident strike while still rewarding accuracy. The second shot asks for discipline, as advancing too aggressively toward the right brings the stream firmly into play.','The hole gradually narrows approaching the green. A well-positioned third shot provides a realistic birdie chance, while careless play can quickly turn costly. Along the Stream is a classic three-shot par 5 that rewards smart course management and steady execution.']},
    11:{title:'Hole 11 — Turning Point',par:4,handicap:8,yardages:{black:407,gold:363,blue:363,red:340},body:['This par 4 gently curves and rewards controlled placement from the tee. The fairway encourages a drive toward the left side, opening up the best angle for the approach, while trees frame the hole and subtly narrow the visual corridor. Distance is less important here than positioning.','The defining feature of the hole comes on the approach. A water hazard guards the front of the green, demanding precise distance control and full commitment to the shot. Anything left short will find trouble, while approaches played with confidence are rewarded with a clear look at the pin. The absence of bunkers places even greater emphasis on judgment and execution rather than recovery.','Turning Point is a thoughtful par 4 that challenges decision-making rather than power. Players who position themselves well from the tee and trust their approach are given a fair opportunity to score, while hesitation is quickly punished.']},
    12:{title:'Hole 12 — Coastline Hole',par:3,handicap:12,yardages:{black:208,gold:186,blue:186,red:166},body:['This par 3 is dominated by water and demands full commitment from the tee. Water runs along both sides of the hole, visually narrowing the line of play and placing immediate pressure on the shot. The green sits safely ahead but feels isolated, rewarding confident execution rather than cautious play.','Trees to the left frame the approach and influence alignment, while the right side offers little margin for error due to the water hazard. The safest play is a committed shot toward the center of the green, as distance control is more important than shaping the ball.','Despite its clean and simple appearance, this hole is mentally demanding. Coastline Hole asks the player to trust their club selection and swing freely, offering a satisfying par to those who commit fully to the shot.']},
    13:{title:'Hole 13 — Gamble',par:5,handicap:10,yardages:{black:538,gold:510,blue:510,red:478},body:['This par 5 is defined by water running closely along the right side for most of the hole, shaping both strategy and shot selection from tee to green. The fairway offers ample width, but the proximity of the water creates constant visual pressure and rewards players who favor the safer left side.','From the tee, a confident drive sets up multiple options for the second shot. Aggressive players may attempt to advance along the right, flirting with the water for a shorter approach, while a more conservative line to the left provides safety at the cost of distance. Trees and subtle narrowing of the fairway increase the importance of positioning as the hole progresses.','The approach into the green demands precision, with water remaining in play along the right and the putting surface inviting a well-shaped shot from the correct angle. Edge of Play is a classic risk-reward par 5 that challenges nerve and decision-making, offering birdie chances only to those willing to manage danger intelligently.']},
    14:{title:'Hole 14 — Clear Line',par:3,handicap:14,yardages:{black:173,gold:157,blue:157,red:145},body:['This par 3 demands a clear plan and confident execution from the tee. Water hazards frame the hole and strongly influence alignment, while the green itself offers a single, well-defined target. The challenge lies not in complexity, but in committing fully to the chosen line.','A bunker guards the right side of the green, punishing shots that drift away from the ideal line. With water nearby and limited room for error, precise distance control is essential. The safest play is a confident shot toward the center of the putting surface, avoiding both sand and water.','Clear Line is a par 3 that rewards decisiveness and trust in club selection. Players who hesitate are quickly punished, while a committed swing is met with a fair chance to score.']},
    15:{title:'Hole 15 — The Cut',par:4,handicap:2,yardages:{black:380,gold:365,blue:348,red:325},body:['This par 4 is shaped almost entirely by water, which runs closely along the left side for the full length of the hole and immediately commands respect from the tee. The fairway curves gently, encouraging a controlled drive favoring the right side, where safety comes at the cost of a longer approach.','Trees along the left edge tighten the corridor and visually pull shots toward the water, while the right side offers a more forgiving line for conservative play. Positioning off the tee is crucial, as it determines both distance and angle into the green.','The approach is played into a green that sits comfortably ahead but remains visually influenced by the water nearby. With limited hazards around the putting surface, success here depends on accuracy and distance control rather than recovery. River Line is a strategic par 4 that rewards discipline and composure, especially late in the round.']},
    16:{title:'Hole 16 — Tight Run',par:5,handicap:16,yardages:{black:493,gold:474,blue:431,red:417},body:['This par 5 is shaped by a narrow strategic corridor and rewards careful planning over aggression. From the tee, trees line the left side of the fairway, immediately influencing the driving line and discouraging shots pulled offline. Water runs along the right side, creating a clear visual boundary and reinforcing the need for controlled placement.','As the hole progresses, dense clusters of trees continue along the left, further narrowing the landing areas and placing increasing importance on positioning for the second shot. While the water remains a constant presence on the right, it is the combination of hazards that defines the hole\'s rhythm and encourages a true three-shot strategy.','The green is guarded by two bunkers, one on the left and one on the right, punishing imprecise approaches and placing a premium on distance control for the final shot. Tight Run is a demanding par 5 that rewards patience, discipline, and intelligent course management from start to finish.']},
    17:{title:'Hole 17 — Measured Risk',par:5,handicap:6,yardages:{black:535,gold:518,blue:518,red:495},body:['This demanding par 5 is defined by precision, distance awareness, and constant water pressure on both sides. Water borders the hole on the left and right, immediately requiring players to know exactly how far they carry the ball with the driver in order to choose the correct landing area from the tee. Distance control is critical, as positioning on the first shot determines whether the hole opens up or becomes progressively more punishing.','The right side of the hole is particularly unforgiving. Shots that drift into the right rough can take a firm bounce toward the water, often turning a small miss into a costly penalty. As a result, players are encouraged to favor a safer line, even if it means sacrificing distance.','The challenge intensifies near the green. Trees guard the right side of the putting surface, while water and trees sit directly behind it. A bunker protects the front of the green, and approach shots that land without enough spin or control can easily release forward or sideways, bringing the water into play. Almost every miss carries the risk of being deflected back toward trouble.']},
    18:{title:'Hole 18 — Last Chance',par:3,handicap:18,yardages:{black:142,gold:125,blue:125,red:113},body:['This short par 3 offers a friendly conclusion to the round, but still requires basic awareness from the tee. A water hazard sits to the right before the green and becomes a factor for shots that fail to carry far enough or drift off line. Players who challenge the right side must fully commit, as anything coming up short risks finding the water.','The safest miss is short and left. Beyond the green on the left side lies a small wooded area, but it is less penal than the water and allows for a playable recovery. The green itself is open and receptive, encouraging confident swings and straightforward distance control.','Last Chance rewards simple, sensible play. A shot aimed at the heart of the green—or a controlled miss short left—provides an excellent opportunity to finish the round with a par or birdie, making this hole a relaxed and satisfying end to the course.']}
  };

  // ============================================================
  // ui helpers
  // ============================================================
  const syncBodyScrollLocks = () => {
    document.body.classList.toggle('menu-open', isMenuOpen);
    document.body.classList.toggle('modal-open', isHoleModalOpen || isAuthModalOpen);
  };

  const setMenuState = (open) => {
    if (!menuToggle) return;
    isMenuOpen = open;
    menuToggle.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (menuLabel) menuLabel.textContent = open ? 'Close Menu' : 'Menu';
    if (menuNav) menuNav.setAttribute('aria-hidden', open ? 'false' : 'true');
    syncBodyScrollLocks();
  };

  const closeHoleModal = () => {
    if (!holeModal) return;
    isHoleModalOpen = false;
    holeModal.classList.remove('is-open');
    holeModal.setAttribute('aria-hidden', 'true');
    syncBodyScrollLocks();
    if (lastFocusedElementBeforeModal && typeof lastFocusedElementBeforeModal.focus === 'function') lastFocusedElementBeforeModal.focus();
    lastFocusedElementBeforeModal = null;
  };

  const openHoleModal = (holeNumber) => {
    if (!holeModal || !holeModalSheet || !holeModalTitle || !holeModalBody || !holeModalPar || !holeModalHandicap || !holeYardageBlack || !holeYardageGold || !holeYardageBlue || !holeYardageRed) return;

    const data = holeDetails[holeNumber] || {title:`Hole ${holeNumber} — Placeholder`,par:'—',handicap:'—',yardages:{black:'—',gold:'—',blue:'—',red:'—'},body:['Текст-заглушка.','Текст-заглушка.']};

    holeModalTitle.textContent = data.title;
    holeModalPar.textContent = `Par ${data.par}`;
    holeModalHandicap.textContent = `Handicap ${data.handicap}`;
    holeYardageBlack.textContent = data.yardages?.black ?? '—';
    holeYardageGold.textContent = data.yardages?.gold ?? '—';
    holeYardageBlue.textContent = data.yardages?.blue ?? '—';
    holeYardageRed.textContent = data.yardages?.red ?? '—';

    holeModalBody.innerHTML = '';
    (data.body || []).forEach((paragraph) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      holeModalBody.appendChild(p);
    });

    lastFocusedElementBeforeModal = document.activeElement;
    isHoleModalOpen = true;
    holeModal.classList.add('is-open');
    holeModal.setAttribute('aria-hidden', 'false');
    syncBodyScrollLocks();
    holeModalSheet.focus();
  };

  // throttled header scroll handler using rAF
  let lastScrollY = -1;
  let headerTicking = false;

  const doHeaderUpdate = () => {
    if (!header) return;
    const scrolled = lastScrollY > 10;
    header.classList.toggle('site-header--solid', scrolled);
    if (logoImage) {
      const defaultSrc = logoImage.getAttribute('data-logo-default') || 'assets/images/branding/logo-white.webp';
      const solidSrc = logoImage.getAttribute('data-logo-solid') || defaultSrc;
      const target = scrolled ? solidSrc : defaultSrc;
      if (logoImage.src !== target) logoImage.src = target;
    }
    headerTicking = false;
  };

  const updateHeaderAppearance = () => {
    lastScrollY = window.scrollY;
    if (!headerTicking) {
      requestAnimationFrame(doHeaderUpdate);
      headerTicking = true;
    }
  };

  // ============================================================
  // menu
  // ============================================================
  if (menuToggle) {
    menuToggle.addEventListener('click', (event) => {
      if (event.target.closest('.menu-item')) { setMenuState(false); return; }
      setMenuState(!isMenuOpen);
    });
    menuToggle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setMenuState(!isMenuOpen); }
    });
  }

  document.addEventListener('click', (event) => {
    if (isMenuOpen && menuToggle && !menuToggle.contains(event.target)) setMenuState(false);
  });

  if (holeModal) {
    holeModal.addEventListener('click', (event) => {
      if (event.target.closest('[data-modal-close]')) closeHoleModal();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (isAuthModalOpen) { closeAuthModal(); return; }
    if (isHoleModalOpen) { closeHoleModal(); return; }
    setMenuState(false);
  });

  // passive listeners for scroll and resize
  window.addEventListener('resize', syncBodyScrollLocks, { passive: true });
  window.addEventListener('scroll', updateHeaderAppearance, { passive: true });

  // ============================================================
  // collapsible sections (golf page)
  // ============================================================
  const collapseSectionContent = (element) => {
    const h = element.scrollHeight;
    element.style.height = h + 'px';
    void element.offsetHeight;
    element.style.height = '0px';
    element.classList.add('is-collapsed');
    element.setAttribute('aria-hidden', 'true');
  };

  const expandSectionContent = (element) => {
    element.classList.remove('is-collapsed');
    const h = element.scrollHeight;
    element.style.height = h + 'px';
    const onEnd = (event) => {
      if (event.propertyName !== 'height') return;
      element.style.height = 'auto';
      element.removeEventListener('transitionend', onEnd);
    };
    element.addEventListener('transitionend', onEnd);
    element.setAttribute('aria-hidden', 'false');
  };

  $$('.course-section-content').forEach((content) => {
    content.style.height = 'auto';
    content.setAttribute('aria-hidden', 'false');
  });

  $$('.course-section-toggle').forEach((toggle) => {
    const icon = $('.course-section-toggle-icon', toggle);
    toggle.setAttribute('aria-expanded', 'true');
    toggle.addEventListener('click', () => {
      const container = toggle.closest('section');
      const content = container ? $('.course-section-content', container) : null;
      if (!content) return;
      const collapsed = content.classList.contains('is-collapsed');
      if (collapsed) {
        expandSectionContent(content);
        if (icon) icon.classList.remove('course-section-toggle-icon--collapsed');
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        collapseSectionContent(content);
        if (icon) icon.classList.add('course-section-toggle-icon--collapsed');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const holesGrid = $('.holes-grid');
  if (holesGrid) {
    holesGrid.addEventListener('click', (event) => {
      const btn = event.target.closest('.hole-tour-button');
      if (btn) openHoleModal(btn.getAttribute('data-hole'));
    });
  }

  // ============================================================
  // venue slider (meetings page)
  // ============================================================
  const venuesSliderRoot = byId('venueSlider');
  const venuesNav = $('.sidebar__nav');
  const venueTitleEl = byId('venueTitle');
  const venueTextEl = byId('venueText');

  if (venuesSliderRoot && venuesNav && venueTitleEl && venueTextEl) {
    const VENUES = {
      "karaoke-lounge": {
        title: "VIP KARAOKE LOUNGE",
        text: "Our VIP Karaoke Lounge is an exclusive private space designed for premium entertainment and comfort. The room combines a stylish living-room atmosphere with a high-end karaoke and home cinema setup, making it ideal for private celebrations, business gatherings, or relaxed evenings with friends. The lounge features spacious seating areas with soft sofas, a large screen with professional sound system, and elegant interior details that create a warm yet modern ambiance. A private dining table allows guests to enjoy food and drinks without leaving the room, ensuring complete privacy and convenience. Perfect for birthdays, small corporate events, or intimate parties, the VIP Karaoke Lounge offers a refined experience where entertainment and comfort come together seamlessly. Seating Capacity: 16 people",
        images: [
          { src: "assets/images/meetings/vip-karaoke-lounge-01.jpg", alt: "VIP KARAOKE LOUNGE — photo 1" },
          { src: "assets/images/meetings/vip-karaoke-lounge-02.jpg", alt: "VIP KARAOKE LOUNGE — photo 2" },
          { src: "assets/images/meetings/vip-karaoke-lounge-03.jpg", alt: "VIP KARAOKE LOUNGE — photo 3" }
        ]
      },
      "banquet-hall": {
        title: "BANQUET HALL WITH TERRACE",
        text: "The Banquet Hall with Terrace is a versatile and elegant venue created for large-scale events and special occasions. The spacious hall features flexible table arrangements, professional stage lighting, and high ceilings that enhance the sense of openness and sophistication. An integrated stage and sound system make the hall suitable for weddings, gala dinners, conferences, and celebrations, while the adjacent terrace provides a perfect outdoor extension for receptions, coffee breaks, or cocktail moments. The refined décor, combined with natural light and modern design elements, creates a memorable setting for any event. Whether you are planning a formal banquet or a vibrant celebration, the Banquet Hall with Terrace offers the space, atmosphere, and functionality to bring your event to life.",
        images: [
          { src: "assets/images/meetings/banquet-hall-terrace-01.jpg", alt: "The Banquet Hall with Terrace — photo 1" },
          { src: "assets/images/meetings/banquet-hall-terrace-02.jpg", alt: "The Banquet Hall with Terrace — photo 2" },
          { src: "assets/images/meetings/banquet-hall-terrace-03.jpg", alt: "The Banquet Hall with Terrace — photo 3" },
          { src: "assets/images/meetings/banquet-hall-terrace-04.jpg", alt: "The Banquet Hall with Terrace — photo 4" },
          { src: "assets/images/meetings/banquet-hall-terrace-05.jpg", alt: "The Banquet Hall with Terrace — photo 5" },
          { src: "assets/images/meetings/banquet-hall-terrace-06.jpg", alt: "The Banquet Hall with Terrace — photo 6" }
        ]
      }
    };

    const MAX_SLIDES = 6;
    const slideInputs = Array.from({ length: MAX_SLIDES }, (_, i) => byId(`slide${i + 1}`));
    const slideImgs = Array.from({ length: MAX_SLIDES }, (_, i) => byId(`slideImg${i + 1}`));

    const withNoSliderAnimation = (updateFn) => {
      venuesSliderRoot.classList.add('no-anim');
      updateFn();
      venuesSliderRoot.offsetHeight;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => venuesSliderRoot.classList.remove('no-anim'));
      });
    };

    const applySlideCount = (count) => {
      const normalized = count <= 3 ? 3 : 6;
      venuesSliderRoot.classList.toggle('is-3', normalized === 3);
      venuesSliderRoot.classList.toggle('is-6', normalized === 6);
      venuesSliderRoot.style.setProperty('--slides', String(normalized));
      for (let i = 0; i < slideInputs.length; i++) {
        const input = slideInputs[i];
        if (!input) continue;
        input.disabled = i >= normalized;
      }
      if (slideInputs[0]) slideInputs[0].checked = true;
    };

    const setSliderImages = (images = []) => {
      applySlideCount(images.length);
      for (let i = 0; i < slideImgs.length; i++) {
        const img = slideImgs[i];
        const data = images[i];
        if (!img) continue;
        if (data) {
          img.src = data.src;
          img.alt = data.alt || `Slide ${i + 1}`;
        } else {
          img.src = "data:,";
          img.alt = "";
        }
      }
    };

    const setActiveVenue = (venueKey) => {
      const venue = VENUES[venueKey];
      if (!venue) return;
      withNoSliderAnimation(() => {
        venueTitleEl.textContent = venue.title;
        venueTextEl.textContent = venue.text;
        setSliderImages(venue.images);
      });
      $$('.venue-link', venuesNav).forEach((btn) => btn.classList.toggle('active', btn.dataset.venue === venueKey));
    };

    venuesNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.venue-link');
      if (!btn) return;
      setActiveVenue(btn.dataset.venue);
    });

    const initialKey = ($('.venue-link.active', venuesNav) || $('.venue-link', venuesNav))?.dataset.venue;
    setActiveVenue(initialKey);
  }

  // ============================================================
  // tournaments page — auth + data
  // ============================================================
  const authSection = byId('tournaments-auth');
  const contentSection = byId('tournaments-content');
  const authModal = byId('auth-modal');
  const authModalSheet = authModal ? $('.auth-modal-sheet', authModal) : null;

  const isTournamentsPage = !!authSection && !!contentSection;

  let currentMember = null;

  const openAuthModal = (mode) => {
    if (!authModal || !authModalSheet) return;
    const loginForm = byId('auth-form-login');
    const signupForm = byId('auth-form-signup');
    if (loginForm) loginForm.style.display = mode === 'login' ? '' : 'none';
    if (signupForm) signupForm.style.display = mode === 'signup' ? '' : 'none';
    clearAuthErrors();
    lastFocusedElementBeforeModal = document.activeElement;
    isAuthModalOpen = true;
    authModal.classList.add('is-open');
    authModal.setAttribute('aria-hidden', 'false');
    syncBodyScrollLocks();
    authModalSheet.focus();
  };

  const closeAuthModal = () => {
    if (!authModal) return;
    isAuthModalOpen = false;
    authModal.classList.remove('is-open');
    authModal.setAttribute('aria-hidden', 'true');
    syncBodyScrollLocks();
    if (lastFocusedElementBeforeModal && typeof lastFocusedElementBeforeModal.focus === 'function') lastFocusedElementBeforeModal.focus();
    lastFocusedElementBeforeModal = null;
  };

  const clearAuthErrors = () => {
    $$('.auth-field-error').forEach(el => el.textContent = '');
    $$('.auth-form-error').forEach(el => el.textContent = '');
    $$('.auth-input--error').forEach(el => el.classList.remove('auth-input--error'));
  };

  const setFieldError = (inputId, message) => {
    const input = byId(inputId);
    const errorEl = byId(inputId + '-error');
    if (input) input.classList.add('auth-input--error');
    if (errorEl) errorEl.textContent = message;
  };

  const setFormError = (formPrefix, message) => {
    const el = byId(formPrefix + '-form-error');
    if (el) el.textContent = message;
  };

  const setButtonLoading = (btnId, loading) => {
    const btn = byId(btnId);
    if (!btn) return;
    btn.classList.toggle('is-loading', loading);
    btn.textContent = loading ? 'Please wait...' : btn.dataset.originalText || btn.textContent;
    if (!loading && btn.dataset.originalText) btn.textContent = btn.dataset.originalText;
  };

  const storeButtonText = (btnId) => {
    const btn = byId(btnId);
    if (btn && !btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
  };

  const normalizeName = (name) => name.toLowerCase().replace(/\s+/g, ' ').trim();

  // ============================================================
  // auth modal event listeners
  // ============================================================
  if (authModal) {
    authModal.addEventListener('click', (event) => {
      if (event.target.closest('[data-auth-modal-close]')) closeAuthModal();
    });
  }

  const openLoginBtn = byId('auth-open-login');
  const openSignupBtn = byId('auth-open-signup');
  if (openLoginBtn) openLoginBtn.addEventListener('click', () => openAuthModal('login'));
  if (openSignupBtn) openSignupBtn.addEventListener('click', () => openAuthModal('signup'));

  const switchToSignup = byId('switch-to-signup');
  const switchToLogin = byId('switch-to-login');
  if (switchToSignup) switchToSignup.addEventListener('click', () => openAuthModal('signup'));
  if (switchToLogin) switchToLogin.addEventListener('click', () => openAuthModal('login'));

  storeButtonText('btn-login');
  storeButtonText('btn-signup');

  // ============================================================
  // login handler
  // ============================================================
  const handleLogin = async () => {
    if (!supabase) return;
    clearAuthErrors();

    const email = (byId('login-email')?.value || '').trim();
    const password = byId('login-password')?.value || '';

    if (!email) { setFieldError('login-email', 'Email is required.'); return; }
    if (!password) { setFieldError('login-password', 'Password is required.'); return; }

    setButtonLoading('btn-login', true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setButtonLoading('btn-login', false);

    if (error) {
      setFormError('login', 'Invalid email or password. Please try again.');
      return;
    }

    closeAuthModal();
    await initTournamentsPage();
  };

  const loginBtn = byId('btn-login');
  if (loginBtn) loginBtn.addEventListener('click', handleLogin);

  // ============================================================
  // signup handler
  // ============================================================
  const handleSignup = async () => {
    if (!supabase) return;
    clearAuthErrors();

    const first = (byId('signup-first')?.value || '').trim();
    const last = (byId('signup-last')?.value || '').trim();
    const email = (byId('signup-email')?.value || '').trim();
    const password = byId('signup-password')?.value || '';
    const confirm = byId('signup-confirm')?.value || '';

    let hasError = false;
    if (!first) { setFieldError('signup-first', 'First name is required.'); hasError = true; }
    if (!last) { setFieldError('signup-last', 'Last name is required.'); hasError = true; }
    if (!email) { setFieldError('signup-email', 'Email is required.'); hasError = true; }
    if (!password) { setFieldError('signup-password', 'Password is required.'); hasError = true; }
    if (password && password.length < 6) { setFieldError('signup-password', 'Password must be at least 6 characters.'); hasError = true; }
    if (password !== confirm) { setFieldError('signup-confirm', 'Passwords do not match.'); hasError = true; }
    if (hasError) return;

    setButtonLoading('btn-signup', true);

    const fullName = `${first} ${last}`;
    const normalizedInput = normalizeName(fullName);

    const { data: members, error: searchError } = await supabase
      .from('members')
      .select('id, full_name, auth_user_id');

    if (searchError) {
      setButtonLoading('btn-signup', false);
      setFormError('signup', 'Something went wrong. Please try again later.');
      return;
    }

    const match = (members || []).find(m => normalizeName(m.full_name) === normalizedInput);

    if (!match) {
      setButtonLoading('btn-signup', false);
      setFormError('signup', 'No matching member found in our records. Only registered club members can create an account.');
      return;
    }

    if (match.auth_user_id) {
      setButtonLoading('btn-signup', false);
      setFormError('signup', 'This member already has an account. Please log in.');
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: match.full_name } }
    });

    console.log('signup result:', { signUpData, signUpError });

    if (signUpError) {
      setButtonLoading('btn-signup', false);
      setFormError('signup', signUpError.message || 'Could not create account. Please try again.');
      return;
    }

    if (signUpData?.user && !signUpData?.session) {
      const userId = signUpData.user.id;
      if (userId) {
        await supabase.rpc('link_member_to_auth', {
          p_member_id: match.id,
          p_user_id: userId,
          p_user_email: email
        });
      }
      setButtonLoading('btn-signup', false);
      setFormError('signup', 'Account created but email confirmation is required. Turn off "Confirm email" in Supabase Auth settings, or check your inbox and then log in.');
      return;
    }

    const userId = signUpData?.user?.id;
    if (userId) {
      const { error: linkError } = await supabase.rpc('link_member_to_auth', {
        p_member_id: match.id,
        p_user_id: userId,
        p_user_email: email
      });
      if (linkError) console.error('member link failed:', linkError);
    }

    setButtonLoading('btn-signup', false);
    closeAuthModal();
    await initTournamentsPage();
  };

  const signupBtn = byId('btn-signup');
  if (signupBtn) signupBtn.addEventListener('click', handleSignup);

  // ============================================================
  // session check and page init
  // ============================================================
  const showAuthWall = () => {
    if (authSection) authSection.style.display = '';
    if (contentSection) contentSection.style.display = 'none';
  };

  const showTournamentContent = () => {
    if (authSection) authSection.style.display = 'none';
    if (contentSection) contentSection.style.display = '';
  };

  const initTournamentsPage = async () => {
    if (!isTournamentsPage || !supabase) return;

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      showAuthWall();
      return;
    }

    // fetch linked member profile
    const { data: memberData } = await supabase
      .from('members')
      .select('*')
      .eq('auth_user_id', session.user.id)
      .single();

    if (!memberData) {
      showAuthWall();
      return;
    }

    currentMember = memberData;
    showTournamentContent();
    renderProfile(memberData, session.user.email);
    await loadTournaments();
  };

  // ============================================================
  // profile
  // ============================================================
  const renderProfile = (member, email) => {
    const nameEl = byId('profile-name');
    const emailEl = byId('profile-email');
    const handicapEl = byId('profile-handicap');
    const statusEl = byId('profile-status');
    if (nameEl) nameEl.textContent = member.full_name;
    if (emailEl) emailEl.textContent = email || member.email || '—';
    if (handicapEl) handicapEl.textContent = Number(member.handicap_index) <= 0 ? `+${Math.abs(member.handicap_index)}` : member.handicap_index;
    if (statusEl) statusEl.textContent = member.membership_status;
  };

  const profileToggle = byId('toggle-profile');
  const profileCard = byId('profile-card');
  if (profileToggle && profileCard) {
    profileToggle.addEventListener('click', () => {
      const visible = profileCard.style.display !== 'none';
      profileCard.style.display = visible ? 'none' : '';
      profileToggle.textContent = visible ? 'My Profile' : 'Hide Profile';
    });
  }

  const changePasswordBtn = byId('btn-change-password');
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', async () => {
      if (!supabase || !currentMember) return;
      const email = currentMember.email;
      if (!email) { alert('No email associated with this account.'); return; }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/tournaments.html'
      });
      if (error) {
        alert('Could not send reset email. Please try again.');
      } else {
        alert('Password reset email sent. Check your inbox.');
      }
    });
  }

  const logoutBtn = byId('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (!supabase) return;
      await supabase.auth.signOut();
      currentMember = null;
      showAuthWall();
      if (profileCard) profileCard.style.display = 'none';
      if (profileToggle) profileToggle.textContent = 'My Profile';
    });
  }

  // ============================================================
  // load and render tournaments
  // ============================================================
  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const loadTournaments = async () => {
    if (!supabase || !currentMember) return;

    const grid = byId('tournaments-grid');
    const loading = byId('tournaments-loading');
    if (loading) loading.style.display = '';

    // fetch tournaments and registrations in parallel
    const [tournamentsRes, registrationsRes] = await Promise.all([
      supabase.from('tournaments').select('*').order('date', { ascending: true }),
      supabase.from('tournament_registrations').select('tournament_id').eq('member_id', currentMember.id)
    ]);

    const tournaments = tournamentsRes.data;
    const tError = tournamentsRes.error;
    const registrations = registrationsRes.data;

    if (loading) loading.style.display = 'none';

    if (tError || !tournaments) {
      if (grid) grid.innerHTML = '<p class="tournaments-loading">Could not load tournaments. Please try again later.</p>';
      return;
    }

    if (tournaments.length === 0) {
      if (grid) grid.innerHTML = '<p class="tournaments-loading">No upcoming tournaments at this time.</p>';
      return;
    }

    const registeredIds = new Set((registrations || []).map(r => r.tournament_id));

    if (grid) {
      // build html as a document fragment for fewer reflows
      const fragment = document.createDocumentFragment();
      tournaments.forEach(t => {
        const isRegistered = registeredIds.has(t.id);
        const handicapOk = Number(currentMember.handicap_index) <= Number(t.required_handicap);
        const card = document.createElement('article');
        card.className = 'tournament-card';

        let btnClass = 'tournament-register-btn';
        let btnText = 'Register';
        let btnDisabled = false;

        if (isRegistered) {
          btnClass += ' tournament-register-btn--registered';
          btnText = 'Registered \u2713';
          btnDisabled = false;
        } else if (!handicapOk) {
          btnText = `Handicap Required: ${t.required_handicap}`;
          btnDisabled = true;
        } else if (!t.registration_open) {
          btnText = 'Registration Closed';
          btnDisabled = true;
        }

        card.innerHTML = `
          <h3 class="tournament-card-title">${escapeHtml(t.title)}</h3>
          <p class="tournament-card-desc">${escapeHtml(t.description || '')}</p>
          <div class="tournament-card-meta">
            <span class="tournament-pill">${formatDate(t.date)}</span>
            <span class="tournament-pill">Max Handicap: ${Number(t.required_handicap) >= 54 ? 'Open' : t.required_handicap}</span>
            <span class="tournament-pill">${escapeHtml(t.format || 'Strokeplay')}</span>
          </div>
          <div class="tournament-card-footer">
            <button class="${btnClass}" type="button" data-tournament-id="${t.id}" ${btnDisabled ? 'disabled' : ''}>${btnText}</button>
          </div>
        `;

        fragment.appendChild(card);
      });
      grid.innerHTML = '';
      grid.appendChild(fragment);
    }
  };

  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  const tournamentsGrid = byId('tournaments-grid');
  if (tournamentsGrid) {
    tournamentsGrid.addEventListener('click', async (event) => {
      const btn = event.target.closest('.tournament-register-btn');
      if (!btn || btn.disabled || !supabase || !currentMember) return;

      const tournamentId = Number(btn.dataset.tournamentId);
      const isCurrentlyRegistered = btn.classList.contains('tournament-register-btn--registered');

      btn.disabled = true;

      if (isCurrentlyRegistered) {
        btn.textContent = 'Cancelling...';

        const { error } = await supabase
          .from('tournament_registrations')
          .delete()
          .eq('tournament_id', tournamentId)
          .eq('member_id', currentMember.id);

        btn.disabled = false;

        if (error) {
          btn.textContent = 'Registered \u2713';
          alert(error.message || 'Could not cancel registration. Please try again.');
          return;
        }

        btn.classList.remove('tournament-register-btn--registered');
        btn.textContent = 'Register';
      } else {
        btn.textContent = 'Registering...';

        const { error } = await supabase
          .from('tournament_registrations')
          .insert({ tournament_id: tournamentId, member_id: currentMember.id });

        btn.disabled = false;

        if (error) {
          btn.textContent = 'Register';
          alert(error.message || 'Could not register. Please try again.');
          return;
        }

        btn.classList.add('tournament-register-btn--registered');
        btn.textContent = 'Registered \u2713';
      }
    });
  }

  // ============================================================
  // init
  // ============================================================
  updateHeaderAppearance();
  setMenuState(false);

  if (isTournamentsPage) {
    initTournamentsPage();
  }
});
