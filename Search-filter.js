class SearchFilter extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const { options, defaultOption } = this.dataset;
    const optionsObject = JSON.parse(options);
    this.innerHTML = `
      <style>
        select {
          padding: 5px;
          margin: 5px;
        }
      </style>
      <select>
        <option value="any">${defaultOption}</option>
        ${Object.entries(optionsObject)
          .map(([id, name]) => `<option value="${id}">${name}</option>`)
          .join("")}
      </select>
    `;
  }
}

customElements.define("search-filter", SearchFilter);