export const metadata = {
  title: 'Admin Dashboard',
  description: 'welcome administrator',
}

export  default async function Dashboard() {

  return (
    <div className="dashboard">
      <div className="contents">
        <h1>Admin Dashboard</h1>
        <div className="flexboxes">
          <div className="box latest-order">
            <h2>Latest Order</h2>
            <ul>
              <li>
                <a href="#">#12345</a> - < span className="total-order">$500.00</span>
              </li>
              <li>
                <a href="#">#12346</a> - < span className="total-order">$250.00</span>
              </li>
              <li>
                <a href="#">#12347</a> - < span className="total-order">$50.00</span>
              </li>
              <li>
                <a href="#">#12348</a> - < span className="total-order">$155.00</span>
              </li>
              <li>
                <a href="#">#12349</a> - < span className="total-order">$20.00</span>
              </li>
            </ul>
          </div>
          <div className="box popular-products">
            <h2>Popular Products</h2>
            <ul>
              <li>
                <a href="#">White Stripes</a> - < span className="total-order">SKU: SK-321</span>
              </li>
              <li>
                <a href="#">Black Stripes</a> - < span className="total-order">SKU: SK-322</span>
              </li>
              <li>
                <a href="#">Zebra Stripes</a> - < span className="total-order">SKU: SK-323</span>
              </li>
              <li>
                <a href="#">Polka Stripes</a> - < span className="total-order">SKU: SK-324</span>
              </li>
              <li>
                <a href="#">Flag Stripes</a> - < span className="total-order">SKU: SK-325</span>
              </li>
            </ul>
          </div>
          <div className="box box4">
            <h2>Most Viewed Products</h2>
            <ul>
              <li>
                <a href="#">White Stripes</a> - < span className="total-order">SKU: SK-321</span>
              </li>
              <li>
                <a href="#">Black Stripes</a> - < span className="total-order">SKU: SK-322</span>
              </li>
              <li>
                <a href="#">Zebra Stripes</a> - < span className="total-order">SKU: SK-323</span>
              </li>
              <li>
                <a href="#">Polka Stripes</a> - < span className="total-order">SKU: SK-324</span>
              </li>
              <li>
                <a href="#">Flag Stripes</a> - < span className="total-order">SKU: SK-325</span>
              </li>
            </ul>
          </div>
          <div className="box newsfeed">
            <h2>Latest News</h2>
            <ul>
              <li>
                <a href="#">Rethinking the Complexity of Software Dev</a>
              </li>
              <li>
                <a href="#">Why You Should Choose SASS</a>
              </li>
              <li>
                <a href="#">The Quickest Way to Test Components That Use Container Queries</a>
              </li>
              <li>
                <a href="#">It’s 2023, But We Still Need to Talk About Nested Styles in CSS</a>
              </li>
              <li>
                <a href="#">Adding Dark Mode to Your Website Using a Single Line of HTML</a>
              </li>
            </ul>
          </div>        
          <div className="box box5">
          <h2>Latest News</h2>
          </div>
          <div className="box box6"><h2>Latest News</h2></div>
          <div className="box box7"><h2>Latest News</h2></div>
          <div className="box box8"><h2>Latest News</h2></div>
        </div>
        
      </div>
      
    
      {/*
      <div className="grid-bottom">
        <div className="box div1">1</div>
        <div className="box div2">2</div>
        <div className="box div3">3</div>
        <div className="box div4">4</div>
        <div className="box div5">5</div>
        <div className="box div6">6</div>
        <div className="box div7">7</div>
        <div className="box div8">8</div>
      </div>


      <div className="container">        
        <div className="hheader">Header</div>
        <div className="ssidebar">Sidebar</div>
        <div className="content-area">Main Content</div>
        <div className="ffooter">Copyright</div>
      </div>
    */}
    </div>      
  )
}
