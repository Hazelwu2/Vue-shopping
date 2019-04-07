export default function(time) {
    let date = new Date(time * 1000);
    date = date.toLocaleDateString().split('/');
    date = date[2]+ '/' + date[1] + '/' + date[0];
    return date;
}