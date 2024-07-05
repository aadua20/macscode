public class Solution extends Karel {

    //on odd rows (1, 3, 5, 7...) karel puts beepers on odd positions (1, 3, 5...)
    private void ODD() {
        putBeeper();
        while(frontIsClear()) {
            move();
            if(frontIsClear()) {
                move();
                putBeeper();
            }
        }
    }


    //on even rows (2, 4 ,6...) karel puts beepers on even positions (2, 4, 6...)
    private void EVEN() {
        while(frontIsClear()) {
            move();
            putBeeper();
            if(frontIsClear()) {
                move();
            }
        }
    }

    // after filling a row, karel must face north.
    private void position() {
        if(facingEast()) {
            turnLeft();			//if karel is on the last position of any row (facing east) it will turn left (face north)
        }else {
            turnRight();		//if karel is on the first position of any row (facing west) it will turn right (face north)
        }

    }


    //after moving to a new row karel must decide to turn left or right
    private void leftOrRight() {
        if(leftIsBlocked()) {
            turnRight();		//if there is a wall on the left of karel it turns right
        }else {
            turnLeft();			//if there is a wall on the right of karel it turns left
        }
    }

    private void mainMove() {
        while(frontIsClear()) {
            if(noBeepersPresent()) {	// if there are no beepers on the last position of a row this means that next row is odd and we must put beeper on the first position of a new row
                move();				//karel moves on a new row if front is clear (it is facing north)
                leftOrRight();
                ODD();
            }else {					//if there is a beeper on the last position of a row this means that next row is even  and we can't put beeper on the first position of a new row
                move();
                leftOrRight();
                EVEN();
            }

            position();			//on the last row there will be wall in front of karel and this while loop will end
        }

    }


    public void run() {
        ODD();			//this fills the first row
        position();		//face north
        mainMove();		//fills every row (until front is blocked)
    }

}