import mysql.connector
import time
import random

# --- SQL Connectivity ---
def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="stargirl15",
        database="dcds_project"
    )

# --- Table Info ---
tables_info = {
    "persons": "All people in the building (person_id, name, role).",
    "rooms": "Lists rooms and floor numbers (room_id, name, floor).",
    "access_logs": "Who entered/exited which room and when (person_id, room_id, direction, ts).",
    "wifi_sessions": "Wi-Fi device connections (device_mac, person_id, ap_name, start_ts, end_ts).",
    "messages": "Messages exchanged between people (sender_id, receiver_id, ts, text).",
    "transactions": "Financial transactions (person_id, vendor, amount, ts, method, note).",
    "inventory": "Items in rooms (item_id, name, room_id, weight_kg).",
    "evidence": "Collected evidences (type, description, found_room_id, ts_found).",
    "alibis": "Statements from people about their whereabouts.",
    "cctv_gaps": "Times when cameras were off (room_id, start_ts, end_ts)."
}

# --- Game Levels ---
levels = [
    ("LEVEL 1", "Show all persons.", "We need a list of everyone inside the building. Start with the 'persons' table."),
    ("LEVEL 2", "Who is the Security Lead?", "Someone from security may have tampered with logs."),
    ("LEVEL 3", "Show access logs ordered by timestamp (latest first).", "Check who moved last before the incident."),
    ("LEVEL 4", "Who entered Meeting Room M3 and when?", "Maya was found there. Let’s trace all entries to M3."),
    ("LEVEL 5", "List all persons and their last access (if any).", "Someone’s log might stop abruptly after the incident."),
    ("LEVEL 6", "List every access log and the room name even if some room details are missing.", "A log might point to a missing room record."),
    ("LEVEL 7", "Combine persons and access logs so all persons and logs appear (simulate full outer join).", "Maybe someone appeared in logs but not in persons list?"),
    ("LEVEL 8", "Show people together with their alibi statements.", "Let's see who provided an alibi—and who didn’t."),
    ("LEVEL 9", "Which rooms had the most access events?", "High traffic rooms might hold hidden evidence."),
    ("LEVEL 10", "Show rooms with more than 1 access.", "Multiple entries near the same time may be suspicious."),
    ("LEVEL 11", "Which unique people accessed the building?", "Check who even entered that night."),
    ("LEVEL 12", "Who was in M3 at any time?", "Focus on M3—our main crime scene."),
    ("LEVEL 13", "List access events during the murder window (00:08–00:16).", "That’s the critical window."),
    ("LEVEL 14", "Who had Wi-Fi active in M3 during the murder window?", "Phones don’t lie—even if people do."),
    ("LEVEL 15", "Total spent per person around midnight.", "Someone bought cleaning items right after..."),
    ("LEVEL 16", "Show movement trace for Olivia Park.", "Her name came up. Let’s track her movements."),
    ("LEVEL 17", "Which persons had logs inside a CCTV gap interval?", "Someone took advantage of the blackout."),
    ("LEVEL 18", "People with either ghost access or Wi-Fi ghost activity.", "Fake entries or devices showing up without people."),
    ("LEVEL 19", "Combine persons with alibis via NATURAL JOIN.", "Cross-check the truth in statements."),
    ("LEVEL 20", "Find the strongest suspect (present in M3 during CCTV gap, Wi-Fi active, bought sanitizer/wipes).", "Time to reveal who did it...")
]

# --- Story and Info Functions ---
def intro_story():
    print("\n🕵️ Welcome, Detective!")
    print("A heinous crime has occurred tonight: the murder of investigative reporter Maya Archer.")
    print("The weapon, the small but lethal **USB Stick**, points to a calculated act of digital espionage and violence.")
    time.sleep(2)
    print("The victim, Maya Archer, was preparing a damning exposé on corporate mismanagement. Her laptop is now missing from her office, M3.")
    print("The attack occurred during a critical CCTV failure in her office, M3, between 00:08:00 and 00:16:00.")
    time.sleep(2)
    print("Key evidence includes unusual access logs, a threatening chat from the CTO, and a mysterious purchase of 'Sanitizer'.")
    print("This is a case of digital murder, where data is both the motive and the key to the killer's identity.")
    
    time.sleep(1)
    choice = input("\nDo you accept the case? (yes/no): ").strip().lower()
    if choice != "yes":
        print("\nMaybe next time, Detective. Case closed.")
        exit()

    name = input("\nEnter your detective name: ").strip()
    print(f"\nWelcome, Detective {name}. Let’s begin our investigation with your AI partner, ‘DataBot’.")
    time.sleep(1.5)
    print("\n DataBot: Ready to dive into the database and expose the truth?")
    input("\n(Press Enter to continue...)")
    return name

def show_tables_info():
    print("\n TABLE REFERENCE:")
    for t, d in tables_info.items():
        print(f"  - {t}: {d}")
    
    print("\n ADVANCED DATABASE OBJECTS:")
    print("  - VIEW V_M3_Traffic: Pre-filtered view of access logs for room M3 (Crime Scene).")
    print("  - VIEW V_Alibi_Statements: Simple join of persons and alibis (for quick review).")
    print("  - PROCEDURE P_Final_Suspect_Check: Executes the full, complex Level 20 query logic.")
    print()

# --- MySQL Operations ---

def execute_query(conn, query, commit=False):
    """Executes a query, handles SELECT output, and supports COMMIT for non-SELECTs."""
    cur = conn.cursor()
    try:
        # Use multi=True for complex statements like procedures/views that might include DROP/CREATE
        # Iterate over all results to clear the buffer (Fixes "Commands out of sync")
        for result in cur.execute(query, multi=True):
            if result.with_rows:
                rows = result.fetchall()
                # Print results only for SELECT-like statements
                if query.strip().lower().startswith("select") or query.strip().lower().startswith("call"):
                    if not rows:
                        print("\n(No data returned)")
                    else:
                        for row in rows:
                            print(row)
            # No 'else' needed here, just ensure we iterate through all results.
                
        if commit:
            conn.commit()
            # Only print success message for DDL/DML, not for interactive SELECT/CALL
            if not (query.strip().lower().startswith("select") or query.strip().lower().startswith("call")):
                 print("\n Query executed successfully.")
            
        return True
    except Exception as e:
        print("\n SQL Error:", e)
        # Attempt to clear the buffer if an error occurred during multi-query execution
        try:
            # Reopen cursor to clear state if necessary, but closing is better.
            cur.close()
            # conn.cursor() # Not strictly necessary if a new cursor is made on the next call
        except:
            pass
        return False
    finally:
        # Ensure the cursor is closed after execution to prevent state issues
        cur.close()


def initialize_database_objects(conn):
    """Creates Views and a Stored Procedure for advanced features demonstration."""
    print("\n[SYSTEM]: Initializing advanced database objects (Views and Procedures)...")
    
    # 1. VIEW: V_M3_Traffic
    view_1_sql = """
    CREATE OR REPLACE VIEW V_M3_Traffic AS
    SELECT p.name AS PersonName, a.ts, a.direction
    FROM access_logs a
    JOIN persons p ON a.person_id = p.person_id
    JOIN rooms r ON a.room_id = r.room_id
    WHERE r.name = 'M3'
    ORDER BY a.ts DESC;
    """
    
    # 2. VIEW: V_Alibi_Statements
    view_2_sql = """
    CREATE OR REPLACE VIEW V_Alibi_Statements AS
    SELECT p.name, p.role, a.statement_text
    FROM persons p
    NATURAL JOIN alibis a;
    """
    
    # 3. PROCEDURE: P_Final_Suspect_Check (Must be run as a multi-statement block)
    procedure_sql = """
    DROP PROCEDURE IF EXISTS P_Final_Suspect_Check;
    CREATE PROCEDURE P_Final_Suspect_Check()
    BEGIN
        SELECT p.name
        FROM persons p 
        LEFT JOIN access_logs a ON p.person_id = a.person_id 
        LEFT JOIN cctv_gaps c ON a.room_id = c.room_id AND a.ts BETWEEN c.start_ts AND c.end_ts 
        LEFT JOIN transactions t ON p.person_id = t.person_id AND (t.note LIKE '%Sanitizer%' OR t.note LIKE '%Wipes%')
        LEFT JOIN wifi_sessions w ON p.person_id = w.person_id AND w.ap_name = 'AP-M3' 
        GROUP BY p.name 
        HAVING COUNT(DISTINCT c.gap_id) > 0 
           AND MAX(CASE WHEN t.note LIKE '%Sanitizer%' OR t.note LIKE '%Wipes%' THEN 1 ELSE 0 END) = 1 
           AND MAX(CASE WHEN w.ap_name = 'AP-M3' THEN 1 ELSE 0 END) = 1;
    END
    """
    
    objects_to_create = {
        "View V_M3_Traffic": view_1_sql,
        "View V_Alibi_Statements": view_2_sql,
        "Procedure P_Final_Suspect_Check": procedure_sql
    }
    
    all_successful = True
    for name, sql in objects_to_create.items():
        # Execute each creation SQL command with commit=True
        status = execute_query(conn, sql, commit=True)
        if status:
            print(f"  ✅ Successfully created {name}.")
        else:
            print(f"  ❌ FAILED to create {name}.")
            all_successful = False
            
    if all_successful:
        print("[SYSTEM]: Database object initialization complete.")
    else:
        print("[SYSTEM]: WARNING: Some objects failed to initialize. Check your MySQL setup and permissions.")
        
    return all_successful

# --- Main Game Loop ---
def play_game():
    conn = connect_db()
    
    # --- Initialization Step ---
    # Call the initialization before any user interaction starts
    if not initialize_database_objects(conn):
        print("\nExiting due to critical database initialization failure.")
        conn.close()
        return

    detective = intro_story()
    show_tables_info()
    time.sleep(1)

    print("\n DataBot: Let’s crack this case, Detective.")
    time.sleep(1)

    for i, (level, desc, clue) in enumerate(levels, start=1):
        print(f"\n==============================")
        print(level," : ",desc)
        print("==============================")
        print(" DataBot: ",clue)
        
        # Hint for Level 20 to use the procedure
        if i == 20:
             print("\n (DataBot: For the presentation demo, you can call the procedure: **CALL P_Final_Suspect_Check();**)")
             
        print("\n(Type 'hint' for a nudge, or 'tables' to review table info.)")

        while True:
            user_query = input("\nEnter your SQL query:\n> ").strip()
            
            if not user_query:
                print("DataBot: Type a query, Detective!")
                continue
                
            if user_query.lower() == "tables":
                show_tables_info()
                continue
                
            if user_query.lower() == "hint":
                hints = [
                    "Try using SELECT * FROM ... first.",
                    "Remember to use WHERE or ORDER BY if needed.",
                    "You might need a JOIN here.",
                    "Look closely at timestamps around 00:10.",
                    "Use LIKE 'M3' or BETWEEN for time filters.",
                    "Consider using the created VIEWS (e.g., V_M3_Traffic) or PROCEDURE (P_Final_Suspect_Check) for quick results!"
                ]
                print(" Hint: ",random.choice(hints))
                continue
            
            # Execute the query (commit=False for most interactive SELECTs)
            # Commit if the query starts with 'call' to ensure the procedure's DML/result is committed
            success = execute_query(conn, user_query, commit=user_query.lower().startswith('call'))
            
            if success:
                time.sleep(0.5)
                # Simple check to see if we move on. 
                if user_query.lower().startswith('select') or user_query.lower().startswith('call'):
                     print("\n Detective ", detective,": Clue data retrieved. Let’s move on...")
                     break
                else: # For DML/DDL that isn't part of the core game flow
                     print("\n Detective ", detective,": Good. Let’s move on...")
                     break
            else:
                print("DataBot: That didn’t quite work. Try again!")

        if i < len(levels):
            input("\nPress Enter to continue to the next clue...")

    # Final Stage
    print("\n FINAL STAGE: The Suspect Reveal")
    time.sleep(1)
    print("\n DataBot: All clues point to one person… but I’ll let you name them.")
    suspect = input("\nWho do you think did it? ").strip().lower()

    correct = "isla gomez"
    if suspect == correct:
        print("\n Correct! Isla Gomez, the Data Scientist, tried to erase her tracks using sanitizer and timing the CCTV blackout.")
        
    else:
        print("\nNot quite, Detective. The real culprit was",correct.title(),".")
        print("You were close though — great investigation!")

    again = input("\nWould you like to replay the case? (yes/no): ").strip().lower()
    if again == "yes":
        play_game()
    else:
        print("\n DataBot: Excellent work, Detective. Case closed.")
        conn.close()
        exit()


if __name__ == "__main__":
    try:
        play_game()
    except mysql.connector.Error as err:
         print(f"\n[FATAL MYSQL ERROR]: Check your connection settings (host, user, password, database) in the connect_db() function. Error: {err}")
    except Exception as e:
         print(f"\n[FATAL ERROR]: An unexpected error occurred: {e}")
