const Paginatrix = require('../src/paginatrix');

describe("Paginatrix", function() {

    



    it('addPart', () => {

        let paginator = new Paginatrix();
        expect(toStr(paginator._addPart([], 1, 4, 0, 2, 0))).toEqual('1,2,3,4')
        expect(toStr(paginator._addPart([], 1, 5, 0, 2, 0))).toEqual('1,2,3,4,5')
        expect(toStr(paginator._addPart([], 1, 6, 0, 2, 0))).toEqual('1,...,<<,5,6')
        expect(toStr(paginator._addPart([], 1, 7, 0, 2, 0))).toEqual('1,...,<<,6,7')

        expect(toStr(paginator._addPart([], 1,  6, 2, 0, 1))).toEqual('1,2,>>,...,6')
        expect(toStr(paginator._addPart([], 6, 20, 2, 0, 1))).toEqual('6,7,>>,...,20')
    });
    

    function toStr(res){
        return res.map(p => !p.current ? p.label || p. page : `*${p.page}*` ).join(',')
    }

    it('getPagination with different page counts', () => {

        let paginator = new Paginatrix();

        expect(toStr(paginator.getPages(4, 1))).toEqual('*1*')
        expect(toStr(paginator.getPages(9, 5))).toEqual('1')
        expect(toStr(paginator.getPages(10, 10))).toEqual('1')
        expect(toStr(paginator.getPages(20, 2))).toEqual('1,*2*')
        expect(toStr(paginator.getPages(29, 2))).toEqual('1,*2*,3')
        expect(toStr(paginator.getPages(30, 2))).toEqual('1,*2*,3')

        expect(toStr(paginator.getPages(35, 2))).toEqual('1,*2*,3,4')

        expect(toStr(paginator.getPages(100, 6))).toEqual('1,2,3,4,5,*6*,7,8,9,10')
        expect(toStr(paginator.getPages(95, 6))).toEqual('1,2,3,4,5,*6*,7,8,9,10')
        expect(toStr(paginator.getPages(200, 5))).toEqual('1,2,3,4,*5*,6,7,>>,...,20')
        expect(toStr(paginator.getPages(200, 7))).toEqual('1,...,<<,5,6,*7*,8,9,>>,...,20')
        expect(toStr(paginator.getPages(200, 17))).toEqual('1,...,<<,15,16,*17*,18,19,20')

        // edge cases before
        // first page selected
        expect(toStr(paginator.getPages(100, 1))).toEqual('*1*,2,3,>>,...,10')      

        // some page selected below the first page(invalid page)
        expect(toStr(paginator.getPages(100, 0))).toEqual('1,2,>>,...,10')      
        expect(paginator.getPages(100, 0).map(p => p.page)).toEqual([1, 2, 5, undefined, 10]);
        expect(paginator.getPages(100, 0).map(p => p.label)).toEqual(['1', '2', '>>', "...", '10']);
        expect(paginator.getPages(100, 0).map(p => p.current)).toEqual([false, false, false, false, false]);  

        // some page selected way below the first page(invalid page)
        expect(paginator.getPages(100, -10).map(p => p.page)).toEqual([1, 2, 5, undefined, 10]);
        expect(paginator.getPages(100, -10).map(p => p.label)).toEqual(['1', '2', '>>', "...", '10']);
        expect(paginator.getPages(100, -10).map(p => p.current)).toEqual([false, false, false, false, false]);  

        // edge cases after
        // last page selected
        expect(paginator.getPages(100, 10).map(p => p.page)).toEqual([1, undefined, 5, 8, 9, 10]);
        expect(paginator.getPages(100, 10).map(p => p.label)).toEqual(['1', "...", '<<', '8', '9', '10']);
        expect(paginator.getPages(100, 10).map(p => p.current)).toEqual([false, false, false, false, false, true]);

        // some page selected after the last page(invalid page)
        expect(paginator.getPages(100, 11).map(p => p.page)).toEqual([1, undefined, 5, 9, 10]);
        expect(paginator.getPages(100, 11).map(p => p.label)).toEqual(['1', "...", '<<', '9', '10']);
        expect(paginator.getPages(100, 11).map(p => p.current)).toEqual([false, false, false, false, false]);    
        
        // some page selected way after the last page(invalid page)
        expect(paginator.getPages(100, 15).map(p => p.page)).toEqual([1, undefined, 5, 9, 10]);
        expect(paginator.getPages(100, 15).map(p => p.label || p.page)).toEqual(['1', "...", '<<', '9', '10']);
        expect(paginator.getPages(100, 15).map(p => p.current)).toEqual([false, false, false, false, false]);        

    

    });
    

//    it('getPagination with different page counts', () => {
//        expect(getPages(30, 1).map(p=>p.page)).toEqual([1, 2, 3])
//        expect(pages.map(p=>p.current)).toEqual([true,false,false])


//    })    
})