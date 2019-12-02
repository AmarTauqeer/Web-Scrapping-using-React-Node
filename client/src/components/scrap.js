import React, { Component } from 'react';
import axios from 'axios';

class scrap extends Component {
  constructor() {
    super();

    this.state = {
      Url: "",
      ResultAsArray: [],
      htmlDocVersion: "",
      PageTitle: "",
      NoOfHeadings: "",
      NoOfInternallinks: "",
      NoOfExternallinks: "",
      NoOfImages: "",
      LargestImage: "",
      CodeStatus: null,

    };
  }

  handleChange = event => {
    this.setState({
      Url: event.target.value
    });
  }


  handleSubmit = event => {
    event.preventDefault();

    const data = {
      Url: this.state.Url,
      loading: true

    };

    axios.post(`/api/scrap`, { data })
      //.then(res => console.log(res.data.output[0]))
      .then(res => this.setState({
        ResultAsArray: (res.data.code === 200 ? res.data.output[0] : [{}]), PageTitle: 'Page Title : ',
        NoOfHeadings: 'Headings : ', NoOfInternallinks: 'Internal Links : ',
        NoOfExternallinks: 'External Links : ', NoOfImages: 'Images : ',
        LargestImage: 'Largest Image : ', CodeStatus: res.data.code,htmlDocVersion : 'Document Version'
      }))
      .catch(err => {
        console.log(err)
      });
  }


  render() {

    return (
      <div>
        <br />
        <br />
        <form onSubmit={this.handleSubmit}>
          <label>
            Url:
            <input type="text" name="Url" onChange={this.handleChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
        <br />
        <br />
        
        {
          this.state.CodeStatus === 500 ? (
            <div> There are some errors. </div>
          ) : 
          this.state.CodeStatus === 404 ? (
            <div> Page not found. </div>
          ) : this.state.CodeStatus === 100 ? (
            <div> Invalid Url. </div>
          ) : (
              !this.state.Url ? (
                <div> Please select a url first. </div>
              ) : (!this.state.ResultAsArray ? (
                <div> Did not find result</div>
              ) : (
                  <div>
                    <table align='Center'>

                      <tbody>
                        <tr><td align='right'>{this.state.htmlDocVersion}</td><td align='left'>{this.state.ResultAsArray.htmlDocVersion}</td></tr>
                        <tr><td align='right'>{this.state.PageTitle}</td><td align='left'>{this.state.ResultAsArray.title}</td></tr>
                        <tr><td align='right'>{this.state.NoOfHeadings}</td><td align='left'>{this.state.ResultAsArray.no_of_headings}</td></tr>
                        <tr><td align='right'>{this.state.NoOfInternallinks}</td><td align='left'>{this.state.ResultAsArray.no_of_internal_links}</td></tr>
                        <tr><td align='right'>{this.state.NoOfExternallinks}</td><td align='left'>{this.state.ResultAsArray.no_of_external_links}</td></tr>
                        <tr><td align='right'>{this.state.NoOfImages}</td><td align='left'>{this.state.ResultAsArray.no_of_images}</td></tr>
                        <tr><td align='right'>{this.state.LargestImage}</td><td align='left'>{this.state.ResultAsArray.largest_image}</td></tr>
                      </tbody>
                    </table>
                  </div>
                )
              )
            )

        }

      </div>
    );
  }
}

export default scrap;
