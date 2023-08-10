import React, { useEffect } from 'react'
import { useState,useRef } from 'react';
import axios from 'axios';

export default function UploadandView(){
    let confidence=0;
    
    const [images,setImages]=useState([]);
    const [isDragging, setIsDragging]=useState(false);
    const [imgAvailable,setImagesAvailable]=useState(false);
    const fileInputRef=useRef(null);
    const [data,setData]=useState(undefined);
    const [file,setSelectFiles]=useState();
    
    
    const sendFile=async()=>{
      setData(undefined)
        if (images && images.length>0) {
            

            const file1= fileInputRef.current.files[0];

            let formData = new FormData();
            formData.append("file", file1,file1.url);
            let res = await axios({
              method: "post",
              url: "http://localhost:8000/predict",
              data: formData,
            });
            console.log(res.data);
            if (res.status === 200) {
              setData(res.data);
              setImagesAvailable(true);
            }
           
          }

    }
    
    
   
    
    function selectFiles(){
        //fileInputRef.current.click();
        fileInputRef.current.click()

    }
    function onFileSelect(event){
        
        const files=event.target.files;
        if(files.length===0){
            return;
        }
        for(let i=0; i<files.length;i++){
            
            if(!images.some((e)=>e.name===files[i].name)){
                setImages((prevImages)=>[
                    ...prevImages,
                    {
                        name:files[i].name,
                        url:URL.createObjectURL(files[i])
                        
                    }
                ])
                
                setImagesAvailable(true);
                
                
                
            }

        }
    }
    function rem(){
        setData(undefined);
        setImages([]);
    }
    function deleteImage(index){
        rem();
        setImages((prevImages )=>
            prevImages.filter((_,i)=>i!==index)
        );

    }
    
    function onDragOver(event){
        event.preventDefault();
        setIsDragging(true);
        event.dataTransfer.dropEffect="copy";


    }
    
    function onDragLeave(event){
        event.preventDefault();
        setIsDragging(false);
    }

    function onDrop(event) {
        event.preventDefault();
        setIsDragging(false);
        const files = event.dataTransfer.files;
      
        if (files.length > 0) {
          const droppedFile = files[0];
          setImages((prevImages) => [
            ...prevImages,
            {
              name: droppedFile.name,
              url: URL.createObjectURL(droppedFile)
            }
          ]);
      
          const fileList = new DataTransfer();
          fileList.items.add(droppedFile);
      
          // Set the new FileList object as the value of the file input
          fileInputRef.current.files = fileList.files;
        }
      }


    return(
        <div className='bg'>
        <div className='card' >
            <div className='top'>
                <p> Drag and Drop leaf Images</p>
            </div>
                <div className='drag-area' onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                    {isDragging?(
                        <span className='select'>
                        Drop images here
                    </span>

                    ):(
                        <>
                         Drag and drop image here or {" "}
                        <span className='select' role='button' onClick={selectFiles}>
                            Browse
                        </span>
                        </>

                    )}
                    

                   
                <input name='file' type='file' className='file' ref={fileInputRef} onChange={onFileSelect} ></input>
                </div>
                <button type='button' onClick={sendFile} >
                    Upload
                </button>
                <div className='container'>
                    {
                        data&&images.map((images,index)=>(
                            <div className='image' key={index}>
                                <span className='delete' onClick={()=>deleteImage(index)}>&times;</span>
                                <img src={images.url} alt={images.name}/>
                                <p>Leaf Type{" "}:{" "}{data.class}</p>
                                {" "}
                                <p> confidence={(parseFloat(data.confidence) * 100).toFixed(2)}</p>
                                

                                
                            </div>
                            

                        ))
                       
                    }
                    
                </div>
                <button type='button' className='clr' onClick={rem} >
                    clear
                </button>
                
        </div>
        </div>
    )
}