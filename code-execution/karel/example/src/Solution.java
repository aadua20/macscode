public class Solution extends Karel {

    // this method builds column.
    private void fillColumn() {
        turnLeft();
        if(noBeepersPresent()) {
            putBeeper();			//puts beeper on the first position of columns
        }
        while(frontIsClear()) {
            move();
            if(noBeepersPresent()) {
                putBeeper();		//karel puts beepers on every point of columns
            }
        }
    }

    // precondition: karel is on the top of a column facing north.
    private void startingPosition() {
        turnAround();
        while(frontIsClear()) {
            move();
        }
        turnLeft();					//post condition: karel returns to its starting position
    }

    // this method moves karel to new column.
    private void nextAvenue() {
        for(int i = 0; i < 4; i++) {
            if(frontIsClear()) {
                move();				//karel moves forward 4 times if front is clear
            }
        }
    }


    //precondition: karel is on (1,1) position facing east.
    public void run() {
        while(frontIsClear()) {
            fillColumn();
            startingPosition();
            nextAvenue();			//karel "builds" columns on every fourth position of rows (1st, 5th, 9th, etc.)
        }
        fillColumn();				//because the condition of "while" is "whileFrontIsClear()"
        //karel needs to build wall on the last position too,
        //because front is not clear anymore


        startingPosition();			//just to return to its starting position
    }
}