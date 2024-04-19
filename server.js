class BinaryHeap {
    constructor(){
        this.heap = [];
    }

    insert(keyId,timestamp){
        this.heap.push({keyId,timestamp});
        this.heapifyUp(this.heap.length -1);
    }

    extractMin(){
        if(this.heap.length === 0) return null;
        const min = this.heap[0];
        const last = this.heap.pop();
        if(this.heap.length > 0){
            this.heap[0] = last;
            this.heapifyDown(0);
        }
        return min.keyId;
    }

    remove(keyId){
        const index = this.heap.findIndex(item => item.keyId === keyId);
        if(index === -1) return;
        const last = this.heap.pop();
        if(index !== this.heap.length){
            this.heap[index] = last;
            if(last.timestamp < this.heap[index].timestamp){
                this.heapifyUp(index);
            }
            else{
                this.heapifyDown(index);
            }
        }
    }

    heapifyUp(index){
        let currentIndex = index;
        while(currentIndex >0){
            const parentIndex = Math.floor((currentIndex-1)/2);
            if(this.heap[currentIndex].timestamp < this.heap[parentIndex].timestamp){
                [this.heap[currentIndex],this.heap[parentIndex]] = [this.heap[parentIndex],this.heap[currentIndex]];
                currentIndex = parentIndex;
            }
            else{
                break;
            }
        }
    }

    heapifyDown(index){
        let currentIndex = index;
        while(currentIndex < this.heap.length){
            const leftChildIndex = 2*currentIndex +1;
            const rightChildIndex = 2*currentIndex +2;
            let smallestChildIndex = currentIndex;
            if(leftChildIndex < this.heap.length && this.heap[leftChildIndex].timestamp < this.heap[smallestChildIndex].timestamp){
                smallestChildIndex = leftChildIndex;
            }
            if(rightChildIndex < this.heap.length && this.heap[rightChildIndex].timestamp < this.heap[smallestChildIndex].timestamp){
                smallestChildIndex = rightChildIndex;
            }
            if(smallestChildIndex !== currentIndex){
                [this.heap[currentIndex], this.heap[smallestChildIndex]] = [this.heap[smallestChildIndex],this.heap[currentIndex]];
                currentIndex = smallestChildIndex;
            }
            else{
                break;
            }

        }
    }
}

class HashTable{
    constructor(){
        this.table = {};
    }

    set(key,value){
        this.table[key] = value;
    }

    get(key){
        return this.table[key];
    }

    delete(key){
        delete this.table[key];
    }
}

const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();
app.use(bodyParser.json());

const availableKeys = new BinaryHeap();
const keyStatus = new HashTable();


app.post('/keys',(req,res) =>{
    const keyId = uuid.v4();
    availableKeys.insert(keyId,Date.now());
    keyStatus.set(keyId,'available');
    setTimeout(() =>{
       keyStatus.set(keyId,'available');

    },60000);

    setTimeout(() =>{
        availableKeys.remove(keyId);
        keyStatus.delete(keyId);
     },300000);

    res.status(201).json({id : keyId});
});

app.get('/keys',(req,res) =>{
    const keyId = availableKeys.extractMin();
    if(!keyId){
        res.status(404).send('No keys available');
    }
    else{
        keyStatus.set(keyId,'blocked');
        res.json({id :keyId});        
    }
});

app.get('/keys/all', (req,res) =>{
   const all = Object.keys(keyStatus.table);
   const values = Object.values(keyStatus.table);
   res.json({all,values});
});

app.head('/keys/:id',(req,res) =>{
    const keyId = req.params.id;
    console.log("f1");
    const status = keyStatus.get(keyId);
    console.log(status);
    if(!status){
        console.log("gg");
        res.status(404).send('key not found');
    }
    else{console.log("going in");
        res.json({id : keyId,status});
    }
});


app.delete('/keys/:id',(req,res) =>{
    const keyId = req.params.id;
    availableKeys.remove(keyId);
    keyStatus.delete(keyId);
    res.status(201).json({message :'deleted successfully'});
});

app.put('/keys/:id',(req,res) =>{
    const keyId = req.params.id;
    keyStatus.set(keyId,'available');
    res.sendStatus(204);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));


function dateBack(string){

}
