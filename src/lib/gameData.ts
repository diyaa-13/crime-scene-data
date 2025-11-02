export const tablesInfo = {
  persons: "All people in the building (person_id, name, role).",
  rooms: "Lists rooms and floor numbers (room_id, name, floor).",
  access_logs: "Who entered/exited which room and when (person_id, room_id, direction, ts).",
  wifi_sessions: "Wi-Fi device connections (device_mac, person_id, ap_name, start_ts, end_ts).",
  messages: "Messages exchanged between people (sender_id, receiver_id, ts, text).",
  transactions: "Financial transactions (person_id, vendor, amount, ts, method, note).",
  inventory: "Items in rooms (item_id, name, room_id, weight_kg).",
  evidence: "Collected evidences (type, description, found_room_id, ts_found).",
  alibis: "Statements from people about their whereabouts.",
  cctv_gaps: "Times when cameras were off (room_id, start_ts, end_ts)."
};

export interface Level {
  number: number;
  title: string;
  description: string;
  clue: string;
  expectedQuery: string;
  hint: string;
  sampleOutput: any[];
}

export const levels: Level[] = [
  {
    number: 1,
    title: "LEVEL 1",
    description: "Show all persons.",
    clue: "We need a list of everyone inside the building. Start with the 'persons' table.",
    expectedQuery: "select * from persons",
    hint: "Try using SELECT * FROM ... first.",
    sampleOutput: [
      { person_id: 1, name: 'Maya Archer', role: 'Reporter' },
      { person_id: 2, name: 'Noah Reed', role: 'CTO' },
      { person_id: 3, name: 'Olivia Park', role: 'Security Lead' },
      { person_id: 4, name: 'Liam Carter', role: 'DevOps' },
      { person_id: 5, name: 'Ava Brooks', role: 'HR Manager' },
      { person_id: 6, name: 'Ethan Price', role: 'Intern' },
      { person_id: 7, name: 'Isla Gomez', role: 'Data Scientist' },
      { person_id: 8, name: 'Mason Cole', role: 'Product Manager' },
      { person_id: 9, name: 'Sophia King', role: 'Office Admin' },
      { person_id: 10, name: 'Lucas Ward', role: 'Engineer' },
      { person_id: 11, name: 'Harper Bell', role: 'PR Lead' },
      { person_id: 12, name: 'Logan West', role: 'Facilities' },
      { person_id: 13, name: 'Zoe Patel', role: 'Legal' },
      { person_id: 14, name: 'Jack Holt', role: 'Finance' },
      { person_id: 15, name: 'GhostUser', role: '(Deactivated ID)' }
    ]
  },
  {
    number: 2,
    title: "LEVEL 2",
    description: "Who is the Security Lead?",
    clue: "Someone from security may have tampered with logs.",
    expectedQuery: "select * from persons where role = 'security lead'",
    hint: "Remember to use WHERE or ORDER BY if needed.",
    sampleOutput: [
      { person_id: 3, name: 'Olivia Park', role: 'Security Lead' }
    ]
  },
  {
    number: 3,
    title: "LEVEL 3",
    description: "Show access logs ordered by timestamp (latest first).",
    clue: "Check who moved last before the incident.",
    expectedQuery: "select * from access_logs order by ts desc",
    hint: "Use ORDER BY to sort results.",
    sampleOutput: [
      { log_id: 9, person_id: null, room_id: 2, direction: 'OUT', ts: '2025-10-02 00:40:00' },
      { log_id: 15, person_id: 11, room_id: 15, direction: 'IN', ts: '2025-10-02 00:30:00' },
      { log_id: 7, person_id: 2, room_id: 5, direction: 'OUT', ts: '2025-10-02 00:25:00' },
      { log_id: 14, person_id: 10, room_id: 9, direction: 'IN', ts: '2025-10-02 00:22:00' },
      { log_id: 4, person_id: 3, room_id: 1, direction: 'OUT', ts: '2025-10-02 00:20:00' },
      { log_id: 8, person_id: 4, room_id: 2, direction: 'IN', ts: '2025-10-02 00:18:00' }
    ]
  },
  {
    number: 4,
    title: "LEVEL 4",
    description: "Who entered Meeting Room M3 and when? (room name from rooms).",
    clue: "Maya was found there. Let's trace all entries to M3.",
    expectedQuery: "select p.name, r.name as room, a.direction, a.ts from access_logs a inner join persons p on a.person_id = p.person_id inner join rooms r on a.room_id = r.room_id where r.name = 'm3' order by a.ts",
    hint: "You might need a JOIN here.",
    sampleOutput: [
      { name: 'Isla Gomez', room: 'M3', direction: 'IN', ts: '2025-10-02 00:02:00' },
      { name: 'Maya Archer', room: 'M3', direction: 'IN', ts: '2025-10-02 00:08:00' },
      { name: 'Olivia Park', room: 'M3', direction: 'IN', ts: '2025-10-02 00:10:00' },
      { name: 'Olivia Park', room: 'M3', direction: 'OUT', ts: '2025-10-02 00:20:00' }
    ]
  },
  {
    number: 5,
    title: "LEVEL 5",
    description: "List all persons and their last access (if any).",
    clue: "Someone's log might stop abruptly after the incident.",
    expectedQuery: "select p.name, a.ts from persons p left join access_logs a on p.person_id = a.person_id order by p.person_id, a.ts desc",
    hint: "LEFT JOIN will help you see people even without access logs.",
    sampleOutput: [
      { name: 'Maya Archer', ts: '2025-10-02 00:08:00' },
      { name: 'Noah Reed', ts: '2025-10-02 00:25:00' },
      { name: 'Noah Reed', ts: '2025-10-02 00:07:00' },
      { name: 'Olivia Park', ts: '2025-10-02 00:20:00' },
      { name: 'Olivia Park', ts: '2025-10-02 00:10:00' },
      { name: 'Olivia Park', ts: '2025-10-02 00:05:00' }
    ]
  },
  {
    number: 6,
    title: "LEVEL 6",
    description: "List every access log and the room name even if some room details are missing.",
    clue: "A log might point to a missing room record.",
    expectedQuery: "select a.log_id, a.ts, r.name as room from access_logs a right join rooms r on a.room_id = r.room_id order by a.ts",
    hint: "RIGHT JOIN is useful here.",
    sampleOutput: [
      { log_id: 12, ts: '2025-10-02 00:02:00', room: 'M3' },
      { log_id: 3, ts: '2025-10-02 00:05:00', room: 'Lobby' },
      { log_id: 10, ts: '2025-10-02 00:06:00', room: 'Cafeteria' },
      { log_id: 6, ts: '2025-10-02 00:07:00', room: 'ConferenceHall' }
    ]
  },
  {
    number: 7,
    title: "LEVEL 7",
    description: "Combine persons and access logs so all persons and logs appear (simulate full outer join).",
    clue: "Maybe someone appeared in logs but not in persons list?",
    expectedQuery: "select p.person_id, p.name, a.log_id, a.ts from persons p left join access_logs a on p.person_id = a.person_id union select p.person_id, p.name, a.log_id, a.ts from persons p right join access_logs a on p.person_id = a.person_id order by person_id, ts",
    hint: "UNION can combine two SELECT statements.",
    sampleOutput: [
      { person_id: 1, name: 'Maya Archer', log_id: 1, ts: '2025-10-02 00:08:00' },
      { person_id: 2, name: 'Noah Reed', log_id: 6, ts: '2025-10-02 00:07:00' },
      { person_id: 2, name: 'Noah Reed', log_id: 7, ts: '2025-10-02 00:25:00' },
      { person_id: null, name: null, log_id: 5, ts: '2025-10-02 00:12:00' }
    ]
  },
  {
    number: 8,
    title: "LEVEL 8",
    description: "Show people together with their alibi statements (use NATURAL JOIN).",
    clue: "Let's see who provided an alibi—and who didn't.",
    expectedQuery: "select name, statement_text, submitted_ts from persons natural join alibis",
    hint: "NATURAL JOIN automatically matches columns with the same name.",
    sampleOutput: [
      { name: 'Noah Reed', statement_text: 'I was in Conference Hall from 00:05 to 00:30', submitted_ts: '2025-10-02 01:00:00' },
      { name: 'Olivia Park', statement_text: 'I was patrolling the Lobby', submitted_ts: '2025-10-02 01:05:00' },
      { name: 'Liam Carter', statement_text: 'Patching servers in ServerRoom', submitted_ts: '2025-10-02 01:10:00' }
    ]
  },
  {
    number: 9,
    title: "LEVEL 9",
    description: "Which rooms had the most access events?",
    clue: "High traffic rooms might hold hidden evidence.",
    expectedQuery: "select r.name as room, count(*) as visits from access_logs a join rooms r on a.room_id = r.room_id group by r.name order by visits desc",
    hint: "GROUP BY and COUNT can help aggregate data.",
    sampleOutput: [
      { room: 'M3', visits: 4 },
      { room: 'Lobby', visits: 3 },
      { room: 'ServerRoom', visits: 3 },
      { room: 'ConferenceHall', visits: 2 }
    ]
  },
  {
    number: 10,
    title: "LEVEL 10",
    description: "Show rooms with more than 1 access in the window (as example).",
    clue: "Multiple entries near the same time may be suspicious.",
    expectedQuery: "select r.name, count(*) as visits from access_logs a join rooms r on a.room_id = r.room_id group by r.name having count(*) > 1",
    hint: "HAVING filters grouped results.",
    sampleOutput: [
      { name: 'M3', visits: 4 },
      { name: 'Lobby', visits: 3 },
      { name: 'ServerRoom', visits: 3 },
      { name: 'ConferenceHall', visits: 2 }
    ]
  },
  {
    number: 11,
    title: "LEVEL 11",
    description: "Which unique people accessed the building?",
    clue: "Check who even entered that night.",
    expectedQuery: "select distinct person_id from access_logs",
    hint: "DISTINCT removes duplicate values.",
    sampleOutput: [
      { person_id: 1 },
      { person_id: 2 },
      { person_id: 3 },
      { person_id: 4 },
      { person_id: 6 },
      { person_id: 7 },
      { person_id: 8 },
      { person_id: 9 }
    ]
  },
  {
    number: 12,
    title: "LEVEL 12",
    description: "Who was in M3 at any time?",
    clue: "Focus on M3—our main crime scene.",
    expectedQuery: "select name from persons where person_id in (select person_id from access_logs where room_id = (select room_id from rooms where name='m3'))",
    hint: "Subqueries (nested SELECT) can help filter data.",
    sampleOutput: [
      { name: 'Maya Archer' },
      { name: 'Olivia Park' },
      { name: 'Isla Gomez' }
    ]
  },
  {
    number: 13,
    title: "LEVEL 13",
    description: "List access events during the murder window (00:08 - 00:16).",
    clue: "That's the critical window.",
    expectedQuery: "select p.name, r.name, a.ts from access_logs a join persons p on a.person_id = p.person_id join rooms r on a.room_id = r.room_id where a.ts between '2025-10-02 00:08:00' and '2025-10-02 00:16:00' order by a.ts",
    hint: "Look closely at timestamps around 00:10.",
    sampleOutput: [
      { name: 'Maya Archer', room: 'M3', ts: '2025-10-02 00:08:00' },
      { name: 'Olivia Park', room: 'M3', ts: '2025-10-02 00:10:00' },
      { name: 'Mason Cole', room: 'M2', ts: '2025-10-02 00:15:00' }
    ]
  },
  {
    number: 14,
    title: "LEVEL 14",
    description: "Who had Wi-Fi active in M3 during the murder window? (join access and wifi by person and timestamps)",
    clue: "Phones don't lie—even if people do.",
    expectedQuery: "select distinct p.name from persons p join wifi_sessions w on p.person_id = w.person_id join access_logs a on p.person_id = a.person_id join rooms r on a.room_id = r.room_id where r.name = 'm3' and w.start_ts <= a.ts and w.end_ts >= a.ts and a.ts between '2025-10-02 00:08:00' and '2025-10-02 00:16:00'",
    hint: "Multiple JOINs can connect several tables.",
    sampleOutput: [
      { name: 'Maya Archer' },
      { name: 'Isla Gomez' }
    ]
  },
  {
    number: 15,
    title: "LEVEL 15",
    description: "Total spent per person around midnight (small amounts in logs).",
    clue: "Someone bought cleaning items right after...",
    expectedQuery: "select p.name, coalesce(sum(t.amount),0) as total_spent from persons p left join transactions t on p.person_id = t.person_id and t.ts between '2025-10-01 23:45:00' and '2025-10-02 00:30:00' group by p.name order by total_spent desc",
    hint: "COALESCE handles NULL values, SUM aggregates amounts.",
    sampleOutput: [
      { name: 'Liam Carter', total_spent: 25.00 },
      { name: 'Noah Reed', total_spent: 15.00 },
      { name: 'Isla Gomez', total_spent: 8.00 },
      { name: 'Ava Brooks', total_spent: 3.50 }
    ]
  },
  {
    number: 16,
    title: "LEVEL 16",
    description: "Show for a person (e.g., Olivia Park) each access and previous room (movement trace).",
    clue: "Her name came up. Let's track her movements.",
    expectedQuery: "select a.ts, r.name as current_room, lag(r.name) over (partition by a.person_id order by a.ts) as previous_room from access_logs a join rooms r on a.room_id = r.room_id join persons p on a.person_id = p.person_id where p.name = 'olivia park' order by a.ts",
    hint: "Window functions like LAG can show previous values.",
    sampleOutput: [
      { ts: '2025-10-02 00:05:00', current_room: 'Lobby', previous_room: null },
      { ts: '2025-10-02 00:10:00', current_room: 'M3', previous_room: 'Lobby' },
      { ts: '2025-10-02 00:20:00', current_room: 'M3', previous_room: 'M3' }
    ]
  },
  {
    number: 17,
    title: "LEVEL 17",
    description: "Which persons had logs inside a CCTV gap interval (possible suspicious presence)?",
    clue: "Someone took advantage of the blackout.",
    expectedQuery: "select distinct p.name, r.name as room, a.ts from access_logs a join persons p on a.person_id = p.person_id join rooms r on a.room_id = r.room_id join cctv_gaps c on a.room_id = c.room_id where a.ts between c.start_ts and c.end_ts order by a.ts",
    hint: "Join with cctv_gaps and check if timestamps overlap.",
    sampleOutput: [
      { name: 'Isla Gomez', room: 'M3', ts: '2025-10-02 00:02:00' },
      { name: 'Maya Archer', room: 'M3', ts: '2025-10-02 00:08:00' },
      { name: 'Olivia Park', room: 'M3', ts: '2025-10-02 00:10:00' }
    ]
  },
  {
    number: 18,
    title: "LEVEL 18",
    description: "People with either (a) ghost access entries OR (b) wifi ghost activity (simulate full outer).",
    clue: "Fake entries or devices showing up without people.",
    expectedQuery: "select p.name, 'ghost_access' as flag from access_logs a join persons p on a.person_id = p.person_id where a.person_id is null union select p2.name, 'ghost_wifi' from wifi_sessions w join persons p2 on w.person_id = p2.person_id where w.person_id = 15",
    hint: "UNION combines results from multiple queries.",
    sampleOutput: [
      { name: 'GhostUser', flag: 'ghost_wifi' }
    ]
  },
  {
    number: 19,
    title: "LEVEL 19",
    description: "Combine persons with alibis via NATURAL JOIN (auto-match by person_id).",
    clue: "Cross-check the truth in statements.",
    expectedQuery: "select name, statement_text, submitted_ts from persons natural join alibis",
    hint: "NATURAL JOIN is useful when column names match.",
    sampleOutput: [
      { name: 'Noah Reed', statement_text: 'I was in Conference Hall from 00:05 to 00:30', submitted_ts: '2025-10-02 01:00:00' },
      { name: 'Olivia Park', statement_text: 'I was patrolling the Lobby', submitted_ts: '2025-10-02 01:05:00' },
      { name: 'Liam Carter', statement_text: 'Patching servers in ServerRoom', submitted_ts: '2025-10-02 01:10:00' }
    ]
  },
  {
    number: 20,
    title: "LEVEL 20",
    description: "Find the strongest suspect (present in M3 during CCTV gap, Wi-Fi active, bought sanitizer/wipes).",
    clue: "Time to reveal who did it...",
    expectedQuery: "select p.name, count(distinct a.log_id) as logs_in_gap, max(case when t.note like '%sanit%' or t.note like '%wipe%' then 1 else 0 end) as bought_wipes, max(case when w.ap_name like '%ap-m3%' then 1 else 0 end) as wifi_in_m3 from persons p left join access_logs a on p.person_id = a.person_id left join cctv_gaps c on a.room_id = c.room_id and a.ts between c.start_ts and c.end_ts left join transactions t on p.person_id = t.person_id left join wifi_sessions w on p.person_id = w.person_id group by p.name having logs_in_gap > 0 and bought_wipes = 1 and wifi_in_m3 = 1 order by logs_in_gap desc",
    hint: "Combine multiple conditions with CASE statements and aggregations.",
    sampleOutput: [
      { name: 'Isla Gomez', logs_in_gap: 1, bought_wipes: 1, wifi_in_m3: 1 }
    ]
  }
];

export const storyText = `A heinous crime has occurred tonight: the murder of investigative reporter Maya Archer.

The weapon, the small but lethal USB Stick, points to a calculated act of digital espionage and violence.

The victim, Maya Archer, was preparing a damning exposé on corporate mismanagement. Her laptop is now missing from her office, M3.

The attack occurred during a critical CCTV failure in her office, M3, between 00:08:00 and 00:16:00.

Key evidence includes unusual access logs, a threatening chat from the CTO, and a mysterious purchase of 'Sanitizer'.

This is a case of digital murder, where data is both the motive and the key to the killer's identity.`;
