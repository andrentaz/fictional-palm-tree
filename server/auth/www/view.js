export default class View {

    static setup(server) {
        this.views.forEach(view => {
            view.method(server);
        });
    }

    getViews() {
        return this.constructor.views.map(view => view['name']);
    }
};