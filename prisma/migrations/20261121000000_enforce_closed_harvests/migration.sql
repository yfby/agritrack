-- A closed harvest is a finished record. The server actions already reject
-- edits and deletes, but these triggers keep that rule true for writes that
-- bypass the app. Reopening (CLOSED -> ACTIVE) and closing remain allowed.
CREATE TRIGGER "Harvest_closed_no_update"
BEFORE UPDATE ON "Harvest"
WHEN OLD."status" = 'CLOSED' AND NEW."status" = 'CLOSED'
BEGIN
    SELECT RAISE(ABORT, 'Closed harvests are read-only. Reopen it first.');
END;

CREATE TRIGGER "Harvest_closed_no_delete"
BEFORE DELETE ON "Harvest"
WHEN OLD."status" = 'CLOSED'
BEGIN
    SELECT RAISE(ABORT, 'Closed harvests cannot be deleted. Reopen it first.');
END;
