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
}

export const levels: Level[] = [
  {
    number: 1,
    title: "LEVEL 1",
    description: "Show all persons.",
    clue: "We need a list of everyone inside the building. Start with the 'persons' table.",
    expectedQuery: "SELECT * FROM persons;",
    hint: "Try using SELECT * FROM ... first."
  },
  {
    number: 2,
    title: "LEVEL 2",
    description: "Who is the Security Lead?",
    clue: "Someone from security may have tampered with logs.",
    expectedQuery: "SELECT * FROM persons WHERE role = 'Security Lead';",
    hint: "Remember to use WHERE or ORDER BY if needed."
  },
  {
    number: 3,
    title: "LEVEL 3",
    description: "Show access logs ordered by timestamp (latest first).",
    clue: "Check who moved last before the incident.",
    expectedQuery: "SELECT * FROM access_logs ORDER BY ts DESC;",
    hint: "Use ORDER BY to sort results."
  },
  {
    number: 4,
    title: "LEVEL 4",
    description: "Who entered Meeting Room M3 and when? (room name from rooms).",
    clue: "Maya was found there. Let's trace all entries to M3.",
    expectedQuery: "SELECT p.name, r.name AS room, a.direction, a.ts FROM access_logs a INNER JOIN persons p ON a.person_id = p.person_id INNER JOIN rooms r ON a.room_id = r.room_id WHERE r.name = 'M3' ORDER BY a.ts;",
    hint: "You might need a JOIN here."
  },
  {
    number: 5,
    title: "LEVEL 5",
    description: "List all persons and their last access (if any).",
    clue: "Someone's log might stop abruptly after the incident.",
    expectedQuery: "SELECT p.name, a.ts FROM persons p LEFT JOIN access_logs a ON p.person_id = a.person_id ORDER BY p.person_id, a.ts DESC;",
    hint: "LEFT JOIN will help you see people even without access logs."
  },
  {
    number: 6,
    title: "LEVEL 6",
    description: "List every access log and the room name even if some room details are missing.",
    clue: "A log might point to a missing room record.",
    expectedQuery: "SELECT a.log_id, a.ts, r.name AS room FROM access_logs a RIGHT JOIN rooms r ON a.room_id = r.room_id ORDER BY a.ts;",
    hint: "RIGHT JOIN is useful here."
  },
  {
    number: 7,
    title: "LEVEL 7",
    description: "Combine persons and access logs so all persons and logs appear (simulate full outer join).",
    clue: "Maybe someone appeared in logs but not in persons list?",
    expectedQuery: "SELECT p.person_id, p.name, a.log_id, a.ts FROM persons p LEFT JOIN access_logs a ON p.person_id = a.person_id UNION SELECT p.person_id, p.name, a.log_id, a.ts FROM persons p RIGHT JOIN access_logs a ON p.person_id = a.person_id ORDER BY person_id, ts;",
    hint: "UNION can combine two SELECT statements."
  },
  {
    number: 8,
    title: "LEVEL 8",
    description: "Show people together with their alibi statements (use NATURAL JOIN).",
    clue: "Let's see who provided an alibi—and who didn't.",
    expectedQuery: "SELECT name, statement_text, submitted_ts FROM persons NATURAL JOIN alibis;",
    hint: "NATURAL JOIN automatically matches columns with the same name."
  },
  {
    number: 9,
    title: "LEVEL 9",
    description: "Which rooms had the most access events?",
    clue: "High traffic rooms might hold hidden evidence.",
    expectedQuery: "SELECT r.name AS room, COUNT(*) AS visits FROM access_logs a JOIN rooms r ON a.room_id = r.room_id GROUP BY r.name ORDER BY visits DESC;",
    hint: "GROUP BY and COUNT can help aggregate data."
  },
  {
    number: 10,
    title: "LEVEL 10",
    description: "Show rooms with more than 1 access in the window (as example).",
    clue: "Multiple entries near the same time may be suspicious.",
    expectedQuery: "SELECT r.name, COUNT(*) AS visits FROM access_logs a JOIN rooms r ON a.room_id = r.room_id GROUP BY r.name HAVING COUNT(*) > 1;",
    hint: "HAVING filters grouped results."
  },
  {
    number: 11,
    title: "LEVEL 11",
    description: "Which unique people accessed the building?",
    clue: "Check who even entered that night.",
    expectedQuery: "SELECT DISTINCT person_id FROM access_logs;",
    hint: "DISTINCT removes duplicate values."
  },
  {
    number: 12,
    title: "LEVEL 12",
    description: "Who was in M3 at any time?",
    clue: "Focus on M3—our main crime scene.",
    expectedQuery: "SELECT name FROM persons WHERE person_id IN (SELECT person_id FROM access_logs WHERE room_id = (SELECT room_id FROM rooms WHERE name='M3'));",
    hint: "Subqueries (nested SELECT) can help filter data."
  },
  {
    number: 13,
    title: "LEVEL 13",
    description: "List access events during the murder window (00:08 - 00:16).",
    clue: "That's the critical window.",
    expectedQuery: "SELECT p.name, r.name, a.ts FROM access_logs a JOIN persons p ON a.person_id = p.person_id JOIN rooms r ON a.room_id = r.room_id WHERE a.ts BETWEEN '2025-10-02 00:08:00' AND '2025-10-02 00:16:00' ORDER BY a.ts;",
    hint: "Look closely at timestamps around 00:10."
  },
  {
    number: 14,
    title: "LEVEL 14",
    description: "Who had Wi-Fi active in M3 during the murder window? (join access and wifi by person and timestamps)",
    clue: "Phones don't lie—even if people do.",
    expectedQuery: "SELECT DISTINCT p.name FROM persons p JOIN wifi_sessions w ON p.person_id = w.person_id JOIN access_logs a ON p.person_id = a.person_id JOIN rooms r ON a.room_id = r.room_id WHERE r.name = 'M3' AND w.start_ts <= a.ts AND w.end_ts >= a.ts AND a.ts BETWEEN '2025-10-02 00:08:00' AND '2025-10-02 00:16:00';",
    hint: "Multiple JOINs can connect several tables."
  },
  {
    number: 15,
    title: "LEVEL 15",
    description: "Total spent per person around midnight (small amounts in logs).",
    clue: "Someone bought cleaning items right after...",
    expectedQuery: "SELECT p.name, COALESCE(SUM(t.amount),0) AS total_spent FROM persons p LEFT JOIN transactions t ON p.person_id = t.person_id AND t.ts BETWEEN '2025-10-01 23:45:00' AND '2025-10-02 00:30:00' GROUP BY p.name ORDER BY total_spent DESC;",
    hint: "COALESCE handles NULL values, SUM aggregates amounts."
  },
  {
    number: 16,
    title: "LEVEL 16",
    description: "Show for a person (e.g., Olivia Park) each access and previous room (movement trace).",
    clue: "Her name came up. Let's track her movements.",
    expectedQuery: "SELECT a.ts, r.name AS current_room, LAG(r.name) OVER (PARTITION BY a.person_id ORDER BY a.ts) AS previous_room FROM access_logs a JOIN rooms r ON a.room_id = r.room_id JOIN persons p ON a.person_id = p.person_id WHERE p.name = 'Olivia Park' ORDER BY a.ts;",
    hint: "Window functions like LAG can show previous values."
  },
  {
    number: 17,
    title: "LEVEL 17",
    description: "Which persons had logs inside a CCTV gap interval (possible suspicious presence)?",
    clue: "Someone took advantage of the blackout.",
    expectedQuery: "SELECT DISTINCT p.name, r.name AS room, a.ts FROM access_logs a JOIN persons p ON a.person_id = p.person_id JOIN rooms r ON a.room_id = r.room_id JOIN cctv_gaps c ON a.room_id = c.room_id WHERE a.ts BETWEEN c.start_ts AND c.end_ts ORDER BY a.ts;",
    hint: "Join with cctv_gaps and check if timestamps overlap."
  },
  {
    number: 18,
    title: "LEVEL 18",
    description: "People with either (a) ghost access entries OR (b) wifi ghost activity (simulate full outer).",
    clue: "Fake entries or devices showing up without people.",
    expectedQuery: "SELECT p.name, 'ghost_access' AS flag FROM access_logs a JOIN persons p ON a.person_id = p.person_id WHERE a.person_id IS NULL UNION SELECT p2.name, 'ghost_wifi' FROM wifi_sessions w JOIN persons p2 ON w.person_id = p2.person_id WHERE w.person_id = 15;",
    hint: "UNION combines results from multiple queries."
  },
  {
    number: 19,
    title: "LEVEL 19",
    description: "Combine persons with alibis via NATURAL JOIN (auto-match by person_id).",
    clue: "Cross-check the truth in statements.",
    expectedQuery: "SELECT name, statement_text, submitted_ts FROM persons NATURAL JOIN alibis;",
    hint: "NATURAL JOIN is useful when column names match."
  },
  {
    number: 20,
    title: "LEVEL 20",
    description: "Find the strongest suspect (present in M3 during CCTV gap, Wi-Fi active, bought sanitizer/wipes).",
    clue: "Time to reveal who did it...",
    expectedQuery: "SELECT p.name, COUNT(DISTINCT a.log_id) AS logs_in_gap, MAX(CASE WHEN t.note LIKE '%sanit%' OR t.note LIKE '%wipe%' THEN 1 ELSE 0 END) AS bought_wipes, MAX(CASE WHEN w.ap_name LIKE '%AP-M3%' THEN 1 ELSE 0 END) AS wifi_in_m3 FROM persons p LEFT JOIN access_logs a ON p.person_id = a.person_id LEFT JOIN cctv_gaps c ON a.room_id = c.room_id AND a.ts BETWEEN c.start_ts AND c.end_ts LEFT JOIN transactions t ON p.person_id = t.person_id LEFT JOIN wifi_sessions w ON p.person_id = w.person_id GROUP BY p.name HAVING logs_in_gap > 0 AND bought_wipes = 1 AND wifi_in_m3 = 1 ORDER BY logs_in_gap DESC;",
    hint: "Combine multiple conditions with CASE statements and aggregations."
  }
];

export const storyText = `A heinous crime has occurred tonight: the murder of investigative reporter Maya Archer.

The weapon, the small but lethal USB Stick, points to a calculated act of digital espionage and violence.

The victim, Maya Archer, was preparing a damning exposé on corporate mismanagement. Her laptop is now missing from her office, M3.

The attack occurred during a critical CCTV failure in her office, M3, between 00:08:00 and 00:16:00.

Key evidence includes unusual access logs, a threatening chat from the CTO, and a mysterious purchase of 'Sanitizer'.

This is a case of digital murder, where data is both the motive and the key to the killer's identity.`;
