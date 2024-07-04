public class Solution extends Karel {

    public void run() {
        while(frontIsClear()) {
            putBeeper();
            move();
        }
        putBeeper();
    }
}