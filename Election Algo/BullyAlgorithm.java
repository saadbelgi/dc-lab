import java.util.Scanner;  
  
class Process{  
    public int id;  
    public String status;  
      
    public Process(int id){  
        this.id = id;  
        this.status = "active";  
    }  
}  
public class BullyAlgorithm {  
      
    Scanner sc;  
    Process[] processes;  
    int n;  
      
    public BullyAlgorithm(){  
        sc= new Scanner(System.in);  
    }  
      
    public void ring(){  
          
        System.out.print("Enter total number of processes: ");  
        n = sc.nextInt();  
          
        processes = new Process[n];  
        for(int i = 0; i< n; i++){  
            processes[i]= new Process(i);  
        }  
    }  
      
    public void performElection(){  
  
        try {  
            Thread.sleep(1000);  
        } catch (InterruptedException e) {  
            
            e.printStackTrace();  
        }  
          
        System.out.println("Process having id "+processes[getMaxValue()].id+" fails");  
          
        processes[getMaxValue()].status = "Inactive";  
          
        int idOfInitiator = 0;  
        boolean overStatus = true;  
          
        while(overStatus){  
              
            boolean higherProcesses = false;  
              
            for(int i = idOfInitiator + 1; i< n; i++){  
                if(processes[i].status == "active"){  
                    System.out.println("Process "+idOfInitiator+" Passes Election ("+idOfInitiator+") message to process " +i);  
                    higherProcesses = true;  

                }  
            }  
              
            if(higherProcesses){  
                  
                for(int i = idOfInitiator + 1; i< n; i++){  
                    if(processes[i].status == "active"){  
                        System.out.println("Process "+i+" passes OK ("+i+") message to process " +idOfInitiator);  
                    }  
  
                }  
                idOfInitiator++;  
            }  
  
            else{  
                int coord = processes[getMaxValue()].id;  
                  
                System.out.println("Finally Process "+coord+" becomes Coordinator");  
                  
                  
                for(int i = coord - 1; i>= 0; i--){  
                    if(processes[i].status == "active"){  
                        System.out.println("Process "+coord+" passes Coordinator ("+coord+") message to process " +i);  
                    }  
                }  
                  
                  
                System.out.println(" End of Election");  
                overStatus = false;  
                break;  
            }  
        }  
  
    }  
      
    public int getMaxValue(){  
        int mxId = -99;  
        int mxIdIndex = 0;  
        for(int i = 0; i<processes.length; i++){  
            if(processes[i].status == "active" && processes[i].id >mxId){  
                mxId = processes[i].id;  
                mxIdIndex = i;  
            }  
        }  
        return mxIdIndex;  
    }  
      
    public static void main(String[] args) {  
          
        BullyAlgorithm bully = new BullyAlgorithm();  
          
        bully.ring();  
        bully.performElection();  
  
    }  
  
} 