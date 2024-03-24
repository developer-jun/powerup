"use client"

//import { zodResolver } from "@hookform/resolvers/zod"
//import * as z from "zod"
import axios, { AxiosError } from 'axios'
//import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'

/*const formSchema = z.object({
  id: z.number().default(0),
  categoryTitle: z.string().min(1, {
    message: "Category Title is Required.",
  }),
  categorySlug: z.string().min(1, {
    message: "Category Slug must be at least 2 characters.",
  }),
  categoryDescription: z.string(),
})*/

// adding async here will cause the browser to freeze
const NewCategoryForm = ({propState, resetProps, categories}) => {
  const route = useRouter();
  //const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
  const [ showSuccessMessage, setShowSuccessMessage ] = useState(false); 
  const [ submitted, setSubmitted ] = useState(false);
  const [ editMode, setEditMode ] = useState(false);
  const [ slugChanged, setSlugChanged] = useState(false);
  const [ categoryId, setCategoryId ] = useState(0);
  const [ categoryParent, setCategoryParent ] = useState(0);
  const [ categoryTitle, setCategoryTitle] = useState('');
  const [ categorySlug, setCategorySlug] = useState('');
  const [ categoryDescription, setCategoryDescription] = useState('');

  const formError = [];
  //const watchCategorySlug = watch("categorySlug", false);

  // 1. Define your form.
  /*const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      categoryTitle: "",
      categorySlug: "",
      categoryDescription: ''
    },
  });*/


  useEffect(() => {
    //console.log('Component Loaded');
    //console.log(propState)
    if(propState != null && !submitted) {
      //setValue("id", propState.id);
      //setValue("categoryTitle", propState.title);
      //setValue("categorySlug", propState.slug);
      //setValue("categoryDescription", propState.description);
      setEditMode(true);
      setShowSuccessMessage(false);
      setSlugChanged(true);
      console.log('Slug has been changed')
    }

    /*const subscription = watch((value, { name, type }) => { 
      if(name === 'categorySlug') {
        console.log(value, name, type)
      }
    })
    return () => subscription.unsubscribe()*/
  });

  // 2. Define a submit handler.
  //const onSubmit = async(values: z.infer<typeof formSchema>) => {
    const handleSubmit = async(e) => {
      e.preventDefault();
      setSubmitted(true);
    
      // DO MANUAL VALIDATION.
      if(categoryTitle.trim() === '') {
        formError.push('Category Title is required!');
      }
      if(categorySlug.trim() === '') {
        formError.push('Category Slug is required!');
      }
     
      const category = {
        title: categoryTitle,
        slug: categorySlug,
        description: categoryDescription
      }

    await axios.post('http://localhost:3000/api/category', category)
      .then(function (response) {
        console.log('Server Reponse');
        console.log(response);
        if(response.data.success === true) {
          console.log('State has been Updated');
          // setTopicUpdated(true);
          // redirect('http://localhost:3000/admin/topic');
          // newTopicAdded();
          setShowSuccessMessage(true);
          if(!categoryId) {
            //setValue("topicTitle", '');
            //setValue("topicDescription", '');
            /*reset({id: 0,
              categoryTitle: "",
              categorySlug: "",
              categoryDescription: ''});*/
            setSlugChanged(false);
            setCategoryId(0);
            setCategoryTitle('');
            setCategorySlug('');
            setCategoryDescription('');


            resetProps({action: 'new_category'});
          } else {
            resetProps({action: 'update_category'});
          }
          
          setTimeout(() => {setSubmitted(false);setShowSuccessMessage(false)}, 3000)
          // will work, but calling the parent component to refetch the data is better. resetProps()        
          // route.refresh();
          
          // form.resetField(topicTitle);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  const handleTitleChange = (e) => {
    const newTitle = e.target.value.trim();
    console.log('Title Change: ', newTitle);
    
    setCategoryTitle(newTitle)
    if(!slugChanged)
      setCategorySlug(newTitle.replace(/\s+/g, '-').toLowerCase());
      // setSlugChanged(false);
      // console.log('Slug reset')
  }

  const handleSlugBlur = (e) => {
    const slug = e.target.value;
    if(slug.trim() === '') {
      setCategorySlug(categoryTitle.replace(/\s+/g, '-').toLowerCase());
      setSlugChanged(false);
      console.log('Make Title Slug')
    }
  }

  const handleSlugChange = (e) => {
    const slug = e.target.value;
    setCategorySlug(slug);
    setSlugChanged(slug !== '');    
    console.log(slug !== '');  
  }

  const handleSelect = (e) => {
    setCategoryParent(e.target.value)
  }
  
  const handleResetForm = () => {
    //setValue("id", 0);
    //setValue("topicTitle", '');
    //setValue("topicDescription", '');
    
    setEditMode(false);
    setShowSuccessMessage(false);
    resetProps({action: 'reset_button'});
  };

  const OptionItemDefault = (id, currentValue) => {
    
    if(id === currentValue) {
      return 'selected';
    }
  }
  const selected = 'selected';
  const empty = '';
  return (
    <div id="category-form" className="card w-96 bg-neutral text-neutral-content">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{editMode?'Update':'New'} Category</h2>
        {showSuccessMessage?
        <div className="containerof w-full">
          <div className="custom-alert alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Category successfully {editMode?'updated':'created'}!</span>
          </div>
        </div>:<></>
        }

        <form>
          <input type="hidden" name="id" value="{categoryId}" />
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Parent Category</span>
            </label>            
            <select className="select w-full max-w-xs" onSelect={handleSelect}>
              <option selected value="0">None</option>
              {categories.map(category => <option value={category.id} >{category.name}</option>)}
            </select>
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Category title</span>
            </label>
            <input 
              type="text" 
              placeholder="Title" 
              className="input input-bordered w-full max-w-xs"
              name="categoryTitle"
              onChange={handleTitleChange} 
              required />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Category URL Slug</span>
            </label>
            <input
              type="text" 
              placeholder="slug" 
              className="input input-bordered w-full max-w-xs" 
              name="categorySlug" 
              value={categorySlug} 
              onChange={handleSlugChange} 
              onBlur={handleSlugBlur}
              required />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea 
              className="textarea textarea-bordered h-24" 
              placeholder="Description"
              name="categoryDescription"
              onChange={(e) => setCategoryDescription(e.target.value)} />
            <label className="label">
              <span className="label-text-alt">Write some specifics about the limit or scope of the topic</span>
            </label>
          </div>
          <div className="card-actions justify-end">
            <button className={`btn btn-primary 
              ${!editMode?'hidden':''}`} type="reset" onClick={handleResetForm}>Reset</button>
            <button className="btn btn-primary" type='submit' onClick={handleSubmit}>{editMode?'Update':'Create'}</button>
          </div>
        </form>          
      </div>
    </div>             
  )
}

export default NewCategoryForm;