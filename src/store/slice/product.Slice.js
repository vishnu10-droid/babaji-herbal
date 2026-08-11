import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { data } from "react-router-dom";
import reducer from "./category.slice";
export const fetchproduct=createAsyncThunk("product/fetchproduct",
  async (_,thunkAPI) =>{
   try{
    const response =await fetctproduct();
    return response
   }catch(errror){
    return thunkAPI.rejectWithValue(response.data.error.message)
   }
  }
)
export const createproduct =createAsyncThunk("product/addproduct",
  async (data,thunkAPI)=>{
    try{
      const response = await addproduct(data);
      return response 
    }catch (error){
      return thunkAPI.rejectWithValue(response.data.message.data)
    }
  }
)

export const updateproduct =createAsyncThunk("product/updateproduct",
  async ({data,id},_thunkAPI)=>{
    try{
      const response = await updateproduct(data,id);
      return response
    }catch (error){
      return thunkAPI.rejectWithValue(response.data.error.message)
    }
  }
)
export const deleteproduct = createAsyncThunk("product/deletproduct",
  async (id, thunkAPI)=>{
    try{
      const respone =await deleteproduct(id);
      return response
    }catch (error){
      return thunkAPI.rejectWithValue(respone.message.data.error)
    }
  }
)

const initialState={
  data:[],
  loading:false,
  error:null
}
const categorySlice=categorySlice({
  name:"product",
  initialState,
  extraReducer:(builder)=>{
    builder
  }
})
//get product

.addcase(fetchproduct.pending,(state)=>{
     state.loading=false;
     state.error=null;
})
.addcase(fetchproduct.fulfilled,(satet,action)=>{
  state.loading=false;
  state.error=null;
  state.data=action.payloading;
})
.addcase(fetchproduct.reject,(state,action)=>{
  state.loading=false;
  state.error=null;
  state.date=action.payloading
})


//addproduct

.addcase(createproduct.pending,(state)=>{
  state.loading=false;
  state.error=null;
})
.addcase (createproduct.fulfilled,(state,action)=>{
  state.loading=false;
  state.error=null;
  state.data=action.payloading;
})
.addcase(createproduct.reject,(state,action)=>{
  state.loading=false;
  state.error=null;
  state.data=action.payloading
})

//update product

.addcase (updateproduct.pending,(state)=>{
  state.loading=false;
  state.error=null;
})
.adddcase(updateproduct.fulfilled,(state,action)=>{
  state.loading=false;
  state.error=null;
  state.data=action.loading
})
.addcase(updateproduct.reject,(state,action)=>{
  state.loading=false;
  state.error=null;
  state.date=action.loading
})

//delete product

.addcase (deleteproduct.pending,(state)=>{
  state.loading=false;
  state.error=null;
})
.addcase(deleteproduct.fulfilled,(state,action)=>{
  state.loading=false;
  state.error=null;
  state.data=action.loading;
})
.addcase(deleteproduct.reject,(state,action)=>{
  state.loading=false;
  state.error=null;
  state.data=action.loading
})