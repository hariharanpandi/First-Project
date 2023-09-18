const PreventSpaceAtFirst = (event: any) => {
    if (event) {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        return (target.selectionStart === 0 && event.code === 'Space')
            ? event.preventDefault()
            : event;
    }
};

export default PreventSpaceAtFirst;
